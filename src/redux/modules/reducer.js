// Absolute imports
import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducer as reduxAsyncConnect } from 'redux-async-connect'
import { routerReducer } from 'react-router-redux'

// Relative imports
import auth from './auth'
import { loadHomestay, loadUser } from './publicData'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  publicData: combineReducers({
    homestay: loadHomestay,
    user: loadUser,
  }),
  form,
})
