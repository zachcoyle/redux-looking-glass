import React from 'react'
import R from 'ramda'
import parseInt from 'parse-int'

import { connect } from 'react-redux'

// todo: refactoring

const notNum = node => (typeof parseInt(node) === 'undefined')

export const arrayFromString = s =>
  R.filter(R.identity,
    R.replace(/\]/g, '',
      R.replace(/\[/g, '.', s)
    ).split('.')
  )

const normalizeLensPath = lp => (typeof lp === 'string') ? arrayFromString(lp) : lp


export const asyncLensFamily = url => lensPathPrefix => lensPaths => ([])



export const lensFamily = lensPathPrefix => lensPaths =>
  lensPaths.map(lp => R.concat(normalizeLensPath(lensPathPrefix), normalizeLensPath(lp)))


const prettyPath = path => {
  const withNums = path.map(
    pathNode => {
      return notNum(pathNode) ? pathNode : `[${parseInt(pathNode)}]`
    }
  )
  .join('.')

  const withFixedLeftBrackets = R.replace(/\.\[/g, '[', withNums)
  const withFixedRightBrackets = R.replace(/\]\.\[/g, ']', withFixedLeftBrackets)

  return withFixedRightBrackets
}


const normalizedName = path => {
  if (notNum(path[path.length - 1])) {
    return path[path.length - 1]
  }

  const noNumPath = path.filter(node => notNum(node))
  return noNumPath[noNumPath.length - 1]
}


//todo: rename me
const mapLenses = (lensPaths, state) =>{
  const mappedLensPath = lensPaths.map(lensPath => {
      const lens = R.lensPath(lensPath)
      const view = R.view(lens, state)
      const path = normalizeLensPath(lensPath)
      return { [`${normalizedName(path)}`]: view }
  })
  return R.mergeAll(mappedLensPath)
}


export const viewLensFamilies = lensFamilies => (state, ownProps) =>
  R.mergeAll(lensFamilies.map(family => mapLenses(family, state)))


export const viewLenses = lensPaths => (state, ownProps) =>
  mapLenses(lensPaths, state)


export const lensAction = lensPath => newVal => ({
  type: `LENS-UPDATE: ${prettyPath(lensPath)}`,
  lensPath,
  newVal,
})


const capitalize = node =>
  node.substr(0, 1).toUpperCase() + node.substr(1)


export const lensRequest = dispatch => ({ path, url, method='GET', body={} }) => {
  const lensPath = normalizeLensPath(path)
  const requestFunc = async (getState) => {
    dispatch({
      type: `LENS-REQUEST-STARTED: ${prettyPath(lensPath)}`,
      lensPath,
      url,
      newVal: { loading: true, finished: false },
    })


    try {
      const response = await fetch(url, { method, body })
      const json = await response.json()
      dispatch({ type: `LENS-REQUEST-RECEIVED: ${prettyPath(lensPath)}`, lensPath, newVal: { loading: false, finished: true, value: json } })
    } catch (e) {
      dispatch({ type: `LENS-REQUEST-RECEIVED: ${prettyPath(lensPath)}`, lensPath, newVal: { loading: false, finished: true, error: e.message } })
    }
  }

  const name = capitalize(normalizedName(normalizeLensPath(lensPath)))

  return ({
    [`request${name}`]: requestFunc
  })

}



export const lensReducer = (reducer=R.identity) => (state = {}, action) => {

  const lens = R.lensPath(action.lensPath)

  if (action.type.startsWith('LENS-UPDATE')           ||
      action.type.startsWith('LENS-REQUEST-RECEIVED') ||
      action.type.startsWith('LENS-REQUEST-STARTED')) {

    return R.set(lens, action.newVal, state)
  }

  return reducer(state)
}


const mapLensToDispatch = dispatch => lensPath => ({
  [`set${capitalize(normalizedName(lensPath))}`]: (value) => dispatch(lensAction(lensPath)(value)),
})


// todo: refactor me, sheesh
const generateLensDispatches = (lensFamilies, dispatch) => {
  const dispatches =
    R.mergeAll(
      R.map(fam =>
        R.mergeAll(
          fam.map(mapLensToDispatch(dispatch))
        ),
      lensFamilies)
    )
  return dispatches
}

const dispatchWrapper = (mapDispatchToProps, lensFamilies, dataSources) => (dispatch, props) => {
  const dispatchProps = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(dispatch, props) : mapDispatchToProps;
  const lensDispatchProps = generateLensDispatches(lensFamilies, dispatch)
  const asyncDispatchProps = R.mergeAll(dataSources.map(lensRequest(dispatch)))
  return { ...dispatchProps, ...lensDispatchProps, ...asyncDispatchProps }
}

const mapStateWrapper = (mapStateToProps, lensFamilies) => (state, props) => {
  const stateProps = typeof mapDispatchToProps === 'function' ? mapStateToProps(state, props) : mapStateToProps;
  const lensStateProps = viewLensFamilies(lensFamilies)(state, props)
  return { ...stateProps, ...lensStateProps }
}


const lookingGlass = (lensFamilies, dataSources=[]) => (mapStateToProps, mapDispatchToProps) => Comp => ({ ...rest }) => {
  const dispatchProps = dispatchWrapper(mapDispatchToProps, lensFamilies, dataSources)
  const stateProps = mapStateWrapper(mapStateToProps, lensFamilies)
  const ComponentWithLenses = connect(stateProps, dispatchProps)(Comp)
  return <ComponentWithLenses {...rest} />
}


export default lookingGlass
