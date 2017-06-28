
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { lensReducer } from '../../src/index'




const rootReducer = lensReducer(
  combineReducers({
    form: formReducer,
  })
)



const loggerMiddleware = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (preloadedState) =>
  createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(thunkMiddleware, loggerMiddleware)
    )
  )

const store = configureStore()

export default store
