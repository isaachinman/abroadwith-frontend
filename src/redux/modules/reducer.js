// Absolute imports
import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { routerReducer } from 'react-router-redux'

// Relative imports
import auth from './auth'
import { loadUserWithAuth, loadHomestayWithAuth } from './privateData/'
import { loadHomestay, loadUser } from './publicData'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  privateData: combineReducers({
    user: loadUserWithAuth,
    home: loadHomestayWithAuth,
  }),
  publicData: combineReducers({
    homestays: loadHomestay,
    users: loadUser,
  }),
  ui: combineReducers({
    form,
  }),
})
