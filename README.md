[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]


# <center>redux-looking glass</center>



![](https://upload.wikimedia.org/wikipedia/commons/9/96/Aliceroom3.jpg)



Redux requires too much boilerplate (and misdirection).

Let's use it as a primitive instead!


## Installation


`npm install --save redux-looking-glass`

or

`yarn add redux-looking-glass`


## Examples

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



[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
