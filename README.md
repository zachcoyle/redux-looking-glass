[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]


# <center>redux-looking glass</center>



![](https://upload.wikimedia.org/wikipedia/commons/9/96/Aliceroom3.jpg)


## Motivation


#### `redux-looking-glass` is smart [Lenses](https://medium.com/javascript-inside/an-introduction-into-lenses-in-javascript-e494948d1ea5) for Redux

The traditional way of using Redux results in cluttered code that is difficult to follow.

The primary goal of this library is to free your code from reducers (and sagas!) and instead have it be more visibile.




## Installation


`npm install --save redux-looking-glass`

or

`yarn add redux-looking-glass`


## Examples

The three main exports from `redux-looking-glass` are:

### `lensReducer`

This function wraps your root reducer, and allows `redux-looking-glass` to do its thing.

([see example](#redux-store-configuration))


### `lensFamily`

This is a curried helper function that just helps you avoid repeating yourself.

```javascript
lensFamily('wonderland.cheshire')(
  'status.visibility',
  'location.tree',
)

// note the following is also valid notation and can be mixed and matched if needed

// lensFamily(['wonderland', 'cheshire'])(
//   ['status', 'visibility],
//   ['location', 'tree'],
// )


```

simply returns 


```javscript
[
  ['wonderland', 'cheshire', 'status', 'visibility'],
  ['wonderland', 'cheshire', 'location', 'tree']
]
```



### `lookingGlass`

This is a curried higher-order-component `lookingGlass([lensFamilies], [dataSources])` returns a function that has the same signature as `react-redux`'s `connect` (and `connect` is called under the hood). 

The reason for this is to allow you to pass in a normal `mapStateToProps` and `mapDispatchToProps` if need be.

[more info on data sources](#async-lenses)


#### Redux Store Configuration

```javascript

import { createStore } from 'redux'
import myRootReducer from 'Reducers'
import { lensReducer } from 'redux-looking-glass'

const configureStore = (preloadedState) =>
  createStore(
    lensReducer(myRootReducer),
    preloadedState
  )


```


---

#### Your Component

```javascript

import React from 'react'
import lookingGlass, { lensFamily } from 'redux-looking-glass'


const cheshireLensFamily = lensFamily('wonderland.cheshireCat')

const cheshireCatLenses = cheshireLensFamily([
  'status.visibility',
])

const displayVisibility = (visibility) => ({
  invisibile: ' ',
  visible: '😸',
  smile: '👄',
}[visibility])

const nextVisibility = (visibility) => ({
  invisibile: 'visible',
  visible: 'smile',
  smile: 'invisibile',
}[visibility])

const CheshireCat = ({ visibility='invisibile', setVisibility }) =>
  <div>
    {displayVisibility(visibility)}
    <button
      onClick={() => setVisibility(nextVisibility(visibility))}
    >
      display {nextVisibility(visibility)}
    </button>
  </div>

const ConnectedCheshireCat = lookingGlass([cheshireCatLenses])(/*mapStateToProps, mapDispatchToProps*/)(CheshireCat)


export default ConnectedCheshireCat


```


![](https://cdn-images-1.medium.com/max/1600/1*bbIuIH0F1kbzxem3LJNnSg.jpeg)



## Async Lenses


#### Current Limitations:

* limited to network side effects
* only supports json
* not a replacement for complex "chain reaction" `redux-saga` flows, just simple ones

```javascript
const dataSource = { path, url, method, body }
const ConnectedCheshireCat = lookingGlass([cheshireCatLenses], [dataSource])(/*mapStateToProps, mapDispatchToProps*/)(CheshireCat)
```

More documentation on async lenses coming soon

### The implementation of async lenses is likely to change, and should currently be considered experimental!



[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
