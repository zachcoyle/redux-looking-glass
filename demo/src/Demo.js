import React from 'react'

import lookingGlass, { lensFamily } from '../../src/index'


import { lukeDataSource, lukeRequestMeta, lukeData, alicelenses } from './MyLenses'



// contrived example :D



const StarWarsProfile = ({ requestLuke, name, height, birth_year, loading, finished, ...rest }) =>
  <div>
    {name || 'Someone'}'s height is:
    {loading && 'Loading...'}
    {finished && height}
    <br />
    birth_year is:
    {loading && 'Loading...'}
    {finished && birth_year}
    <br />
  </div>



const StarWars = ({ requestLuke, ...rest }) =>
  <div>
    <button onClick={ () => requestLuke() }>
      pew pew
    </button>
    <StarWarsProfile {...rest} />
  </div>

const ConnectedStarWars = lookingGlass([lukeRequestMeta, lukeData], [lukeDataSource])()(StarWars)



const cheshireLensFamily = lensFamily('wonderland.cheshireCat')

const cheshireCatLenses = cheshireLensFamily([
  '[10][12].status.visibility',
])

const CheshireCat = ({ visibility='invisibile', setVisibility }) =>
  <div>
    {{
      invisibile: ' ',
      visible: '😸',
      smile: '👄',
    }[visibility]}
    <button
      onClick={() => setVisibility(nextVisibility(visibility))}
    >
      display {nextVisibility(visibility)}
    </button>
  </div>

const ConnectedCheshireCat = lookingGlass([cheshireCatLenses])()(CheshireCat)

const nextVisibility = (visibility) => {
  return {
    invisibile: 'visible',
    visible: 'smile',
    smile: 'invisibile',
  }[visibility]
}






const Demo = ({ dispatch, cheshire, setCheshire }) =>
  <div>
    <ConnectedCheshireCat />
    <hr style={{padding: 20}}/>
    <ConnectedStarWars />
  </div>


export default lookingGlass([alicelenses])()(Demo)
