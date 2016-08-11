import { combineReducers } from 'redux'
import multireducer from 'multireducer'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-async-connect'

import auth from './auth'
import counter from './counter'
import { reducer as form } from 'redux-form'
import loadHomestay from './loadHomestay'
import widgets from './widgets'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  loadHomestay,
  form,
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter,
  }),
  widgets,
})
