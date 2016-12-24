// Absolute imports
import { combineReducers } from 'redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { routerReducer } from 'react-router-redux'

// Relative imports
import auth from './auth'
import clientToken from './payments/client-token'
import currency from './ui/currency'
import locale from './ui/locale'
import { loadUserWithAuth, loadHomestayWithAuth } from './privateData/'
import { loadHomestay, loadUser } from './publicData'
import messaging from './privateData/messaging/messaging'
import verifications from './privateData/users/verifications'

export default combineReducers({
  auth,
  messaging,
  routing: routerReducer,
  reduxAsyncConnect,
  privateData: combineReducers({
    user: loadUserWithAuth,
    home: loadHomestayWithAuth,
  }),
  publicData: combineReducers({
    homestays: loadHomestay,
    users: loadUser,
  }),
  ui: combineReducers({
    currency,
    locale,
  }),
  payments: combineReducers({
    clientToken,
  }),
  verifications,
})
