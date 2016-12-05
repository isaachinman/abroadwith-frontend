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
  // Lazy loaded routes: some edge-case routes should only be loaded if needed
  // The third argument require.ensure takes is the name of the chunk
  // --------------------------------------------------------------------------------
  const getFAQ = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/FAQ/FAQ'))
    }, 'faq')
  }
  const getTermsAndConditions = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/TermsAndConditions/TermsAndConditions'))
    }, 'terms')
  }

  // --------------------------------------------------------------------------------
  // Please keep routes in alphabetical order
  // With the exception of Main, as this is the IndexRoute
  // --------------------------------------------------------------------------------

  return (
    <Route path='/' component={App}>

      <IndexRoute component={Main} />

      <Route path='contact' component={ContactUs} />

      <Route path='faq' getComponent={getFAQ} />

      <Route path='homestay/:homeID' component={Homestay} />

      <Route onEnter={requireLogin}>
        <Route path='loginSuccess' component={LoginSuccess} />
      </Route>

      <Route path='login' component={LoginPage} />

      <Route path='terms' getComponent={getTermsAndConditions} />

      <Route path='users/:userID' component={UserProfile} />

      <Route path='*' component={NotFound} status={404} />

    </Route>
  )
}
