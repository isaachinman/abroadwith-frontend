import React from 'react'
import { IndexRoute, Route } from 'react-router'
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth'
import {
    App,
    ContactUs,
    Homestay,
    LoginPage,
    LoginSuccess,
    Main,
    NotFound,
    TermsAndConditions,
    UserProfile,
  } from 'containers'

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {

    function checkAuth() {
      const { auth: { user } } = store.getState()
      if (!user) {
        // User is not logged in, and will get bounced to homepage
        replace('/')
      }
      cb()
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth)
    } else {
      checkAuth()
    }
  }

  // --------------------------------------------------------------------------------
  // Please keep routes in alphabetical order
  // With the exception of Main, as this is the IndexRoute
  // --------------------------------------------------------------------------------

  return (
    <Route path='/' component={App}>

      <IndexRoute component={Main} />

      <Route path='contact' component={ContactUs} />

      <Route path='homestay/:homeID' component={Homestay} />

      <Route onEnter={requireLogin}>
        <Route path='loginSuccess' component={LoginSuccess} />
      </Route>

      <Route path='login' component={LoginPage} />

      <Route path='terms' component={TermsAndConditions} />

      <Route path='users/:userID' component={UserProfile} />

      <Route path='*' component={NotFound} status={404} />

    </Route>
  )
}
