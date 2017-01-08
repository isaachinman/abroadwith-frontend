import React from 'react'
import { IndexRoute, Route } from 'react-router'
import { isLoaded as isAuthLoaded } from 'redux/modules/auth'
import UILanguages from 'data/constants/UILanguages'
import {
    App,
    ContactUs,
    Homestay,
    LoginPage,
    LoginSuccess,
    Main,
    SignupPage,
    UserProfile,
  } from 'containers'

export default (store) => {

  const requireLogin = (nextState, replace, cb) => {

    function checkAuth() {

      const { auth: { jwt } } = store.getState()
      if (!jwt) {
        // User is not logged in, and will get bounced to homepage
        replace('/')
      }
      cb()
    }

    if (!isAuthLoaded(store.getState())) {
      checkAuth()
    }

  }

  // --------------------------------------------------------------------------------
  // Lazy loaded routes: some routes should only be loaded if needed
  // The third argument require.ensure takes is the name of the chunk
  // --------------------------------------------------------------------------------
  const getFAQ = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/FAQ/FAQ'))
    }, 'faq')
  }
  const getInbox = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Inbox/Inbox'))
    }, 'inbox')
  }
  const getInvite = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Invite/Invite'))
    }, 'invite')
  }
  const getInvoice = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Invoice/Invoice'))
    }, 'invoice')
  }
  const getTermsAndConditions = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/TermsAndConditions/TermsAndConditions'))
    }, 'terms')
  }
  const getReceipt = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Receipt/Receipt'))
    }, 'receipt')
  }
  const getSettings = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Settings/Settings'))
    }, 'settings')
  }
  const getPrivacyPolicy = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/PrivacyPolicy/PrivacyPolicy'))
    }, 'privacy-policy')
  }

  // --------------------------------------------------------------------------------
  // Please keep routes in alphabetical order
  // With the exception of Main, as this is the IndexRoute
  // --------------------------------------------------------------------------------

  return (

    <span>
      {Object.values(UILanguages).map(locale => {
        return (
          <Route path={`${locale.basepath}`} key={locale.basepath} locale={locale} component={App} status={200}>

            <IndexRoute component={Main} />

            <Route path='contact' component={ContactUs} />

            <Route path='faq' getComponent={getFAQ} />

            <Route path='homestay/:homeID' component={Homestay} />

            <Route onEnter={requireLogin}>
              <Route path='inbox' getComponent={getInbox} />
              <Route path='invite' getComponent={getInvite} />
              <Route path='loginSuccess' component={LoginSuccess} />
              <Route path='user/:userID/invoices/:invoiceID' getComponent={getInvoice} />
              <Route path='user/:userID/bookings/:bookingID/receipt' getComponent={getReceipt} />
              <Route path='settings' getComponent={getSettings} />
            </Route>

            <Route path='login' component={LoginPage} />

            <Route path='privacy' getComponent={getPrivacyPolicy} />

            <Route path='signup' component={SignupPage} />

            <Route path='terms' getComponent={getTermsAndConditions} />

            <Route path='user/:userID' component={UserProfile} />

          </Route>
        )
      })}
      <Route path='*' component={App} status={404} />
    </span>
  )
}
