import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-async-connect'

import auth from './auth'
import { reducer as form } from 'redux-form'
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
