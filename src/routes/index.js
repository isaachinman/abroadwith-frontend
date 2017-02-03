import React from 'react'
import { IndexRoute, Redirect, Route } from 'react-router'
import { isLoaded as isAuthLoaded } from 'redux/modules/auth'
import { hideFooter, showFooter } from 'redux/modules/ui/footer'
import UILanguages from 'data/constants/UILanguages'
import {
    App,
    ContactUs,
    Homestay,
    LoginPage,
    LoginSuccess,
    Main,
    SearchHomestays,
    SignupPage,
    UserProfile,
  } from 'containers'

export default (store) => {

  const noFooterEnter = liftedStore => {
    liftedStore.dispatch(hideFooter())
  }
  const noFooterLeave = liftedStore => {
    liftedStore.dispatch(showFooter())
  }

  const checkLocaleEnter = (nextState, replace, cb) => {

    const { routing, ui } = store.getState()
    const route = routing.locationBeforeTransitions.pathname

    if (ui.locale.value === 'en') {

      Object.keys(UILanguages).map(locale => {
        if (route.indexOf(`/${locale}/`) > -1) {
          replace(route.replace(`/${locale}`, ''))
        }
      })

    } else {

      let onRightSite = true
      let languageToRemove

      if (route.indexOf(`/${ui.locale.value}`) === -1) {
        onRightSite = false
      }

      Object.keys(UILanguages).map(locale => {
        if (locale !== ui.locale.value && route.indexOf(`/${locale}/`) > -1) {
          onRightSite = false
          languageToRemove = locale
        }
      })

      if (!onRightSite) {
        replace(`/${ui.locale.value}` + route.replace(`/${languageToRemove}`, ''))
      }
    }
    cb()
  }

  const checkLocaleChange = (prevState, nextState, replace, cb) => {
    checkLocaleEnter(nextState, replace, cb)
  }

  const singleHomeRedirect = (nextState, replace) => {
    const { homeIds } = store.getState().privateData.user.data
    if (homeIds.length === 1) {
      replace(`/manage-home/${homeIds[0]}`)
    }
  }

  const requireLogin = (nextState, replace) => {

    function checkAuth() {

      const { auth: { jwt } } = store.getState()
      if (!jwt) {
        // User is not logged in, and will get bounced to homepage
        replace('/')
      }
    }

    if (!isAuthLoaded(store.getState())) {
      checkAuth()
    }

  }

  // --------------------------------------------------------------------------------
  // Lazy loaded routes: some routes should only be loaded if needed
  // The third argument require.ensure takes is the name of the chunk
  // --------------------------------------------------------------------------------
  const getEmailVerification = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/EmailVerification/EmailVerification'))
    }, 'email-verification')
  }
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
  const getManageHome = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../components/ManageHome/ManageHome'))
    }, 'manage-home')
  }
  const getManageHomeLandingPage = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/ManageHomeLandingPage/ManageHomeLandingPage'))
    }, 'manage-home')
  }
  const getTermsAndConditions = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/TermsAndConditions/TermsAndConditions'))
    }, 'terms')
  }
  const getThread = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../components/Thread/Thread'))
    }, 'inbox')
  }
  const getReceipt = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Receipt/Receipt'))
    }, 'receipt')
  }
  const getReservations = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Reservations/Reservations'))
    }, 'reservations')
  }
  const getReservationDetails = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/ReservationDetails/ReservationDetails'))
    }, 'reservations')
  }
  const getReview = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Review/Review'))
    }, 'reviews')
  }
  const getReviewEducator = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../components/ReviewEducator/ReviewEducator'))
    }, 'reviews')
  }
  const getReviewHome = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../components/ReviewHome/ReviewHome'))
    }, 'reviews')
  }
  const getReviewUser = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../components/ReviewUser/ReviewUser'))
    }, 'reviews')
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
          <Route
            path={`${locale.basepath}`}
            key={locale.basepath}
            locale={locale}
            component={App}
            onEnter={checkLocaleEnter}
            onChange={checkLocaleChange}
            status={200}
          >

            <IndexRoute component={Main} />

            <Route path='contact-us' component={ContactUs} />

            <Route path='faq' getComponent={getFAQ} />

            <Route path='homestay/:homeID' component={Homestay} />

            <Route onEnter={requireLogin}>
              <Route path='verify/email' getComponent={getEmailVerification} />
              <Route path='inbox' getComponent={getInbox} />
              <Route path='invite' getComponent={getInvite} />
              <Route path='login-success' component={LoginSuccess} />
              <Route path='manage-home' getComponent={getManageHomeLandingPage} onEnter={singleHomeRedirect} />
              <Route path='manage-home/:homeID' getComponent={getManageHome} />
              <Route path='invoice/:invoiceID' getComponent={getInvoice} />
              <Route path='user/:userID/bookings/:bookingID/receipt' getComponent={getReceipt} />
              <Route path='reservations' getComponent={getReservations} />
              <Route path='reservation/:reservationID' getComponent={getReservationDetails} />
              <Route path='review' getComponent={getReview}>
                <Route path='educator/:educatorID' getComponent={getReviewEducator} />
                <Route path='home/:homeID' getComponent={getReviewHome} />
                <Route path='user/:userID' getComponent={getReviewUser} />
              </Route>
              <Route path='settings' getComponent={getSettings} />
              <Route path='thread/:threadID' getComponent={getThread} />
            </Route>

            <Route
              path='language-homestay/search'
              onEnter={() => noFooterEnter(store)}
              onLeave={() => noFooterLeave(store)}
              component={SearchHomestays}
            />

            <Route path='login' component={LoginPage} />

            <Route path='privacy' getComponent={getPrivacyPolicy} />

            <Route path='signup' component={SignupPage} />

            <Route path='terms' getComponent={getTermsAndConditions} />

            <Route path='user/:userID' component={UserProfile} />

          </Route>
        )
      })}
      {Object.values(UILanguages).map(locale => {
        return (
          <Redirect from={`/${locale.iso2}`} to={locale.basepath} key={locale.iso2} />
        )
      })}
      <Route path='*' component={App} status={404} />
    </span>
  )
}
