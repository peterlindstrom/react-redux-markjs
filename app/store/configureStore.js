import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import apiMiddleware from '../middleware/api'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: (getState, action) => true
})

let middlewares = [
  thunkMiddleware,
  apiMiddleware,
];

if (process.env.NODE_ENV !== 'production') {
  middlewares = [...middlewares, logger]
}

const createStoreWithMiddleware = applyMiddleware(
  ...middlewares
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
