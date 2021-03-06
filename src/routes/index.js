// Absolute imports
import React from 'react'
import { IndexRoute, Redirect, Route } from 'react-router'
import { isLoaded as isAuthLoaded } from 'redux/modules/auth'
import { hideFooter, showFooter } from 'redux/modules/ui/footer'
import UILanguages from 'data/constants/UILanguages'

// Public routes (included in main bundle)
import {
    AbroadwithForHosts,
    AbroadwithForStudents,
    About,
    App,
    ContactUs,
    CourseLandingPage,
    Homestay,
    LoginPage,
    LoginSuccess,
    Main,
    PopularLanguages,
    School,
    SearchCourses,
    SearchHomestays,
    SignupPage,
    UserProfile,
    Testimonials,
  } from 'containers'

export default (store) => {

  // Hide and show footer based on route
  const noFooterEnter = liftedStore => {
    liftedStore.dispatch(hideFooter())
  }
  const noFooterLeave = liftedStore => {
    liftedStore.dispatch(showFooter())
  }

  // Locale subpath redirection
  const checkLocaleEnter = (nextState, replace, cb) => {

    const { routing, ui } = store.getState()
    const route = routing.locationBeforeTransitions.pathname + routing.locationBeforeTransitions.search

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

  // Change function, identical to enter function
  const checkLocaleChange = (prevState, nextState, replace, cb) => checkLocaleEnter(nextState, replace, cb)

  // Manage home always lands on /manage-home, but if a user only has
  // one home, this redirects them to /manage-home/{homeID}
  const singleHomeRedirect = (nextState, replace) => {
    const { homeIds } = store.getState().privateData.user.data
    if (homeIds.length === 1) {
      replace(`/manage-home/${homeIds[0]}`)
    }
  }

  // Require potential bookings on booking pages
  const requirePotentialCourseBooking = (nextState, replace) => {
    if (!store.getState().bookings.courseBookings.potentialBooking.courseId) {
      replace('/')
    }
  }
  const requirePotentialHomestayBooking = (nextState, replace) => {
    if (!store.getState().bookings.homestayBookings.potentialBooking.stayId) {
      replace('/')
    }
  }

  // Simple auth check for logged-in pages
  const requireLogin = (nextState, replace) => {

    function checkAuth() {
      if (!store.getState().auth.jwt) {

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
  // ----------
  // What you will see below is an absolute tonne of boilerplate
  // Unfortunately, it's unavoidable. require and require.ensure must receive
  // string literals, variables won't work. It must be known at compile time
  // without program flow analysis. These getComponent functions only contain
  // the require.ensure statement, so we are stuck writing them all explicitly.
  // --------------------------------------------------------------------------------

  const getBookCourse = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/BookCourse/BookCourse'))
    }, 'booking-course')
  }
  const getBookCourseSuccess = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/BookCourse/BookCourseSuccess'))
    }, 'booking-course')
  }
  const getBookHomestay = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/BookHomestay/BookHomestay'))
    }, 'booking-homestay')
  }
  const getBookHomestaySuccess = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/BookHomestay/BookHomestaySuccess'))
    }, 'booking-homestay')
  }
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
  const getInvoiceCourse = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/InvoiceCourse/InvoiceCourse'))
    }, 'invoice')
  }
  const getInvoiceHomestay = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/InvoiceHomestay/InvoiceHomestay'))
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
  const getPrivacyPolicy = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/PrivacyPolicy/PrivacyPolicy'))
    }, 'privacy-policy')
  }
  const getReceiptCourse = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/ReceiptCourse/ReceiptCourse'))
    }, 'receipt')
  }
  const getReceiptHomestay = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/ReceiptHomestay/ReceiptHomestay'))
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
  const getResetPassword = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/ResetPassword/ResetPassword'))
    }, 'reset-password')
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
  const getTrips = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/Trips/Trips'))
    }, 'trips')
  }
  const getUserProfileEdit = (nextState, cb) => {
    require.ensure([], require => {
      cb(null, require('../containers/UserProfileEdit/UserProfileEdit'))
    }, 'edit-profile')
  }

  // --------------------------------------------------------------------------------
  // Please keep routes in alphabetical order
  // With the exception of Main, as this is the IndexRoute
  // --------------------------------------------------------------------------------
  return (

    <span>
      {/* These routes are looped and produced for each locale */}
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

            <Route path='about' component={About} />
            <Route path='abroadwith-for-students' component={AbroadwithForStudents} />
            <Route path='contact-us' component={ContactUs} />
            <Route path='faq' getComponent={getFAQ} />
            <Route path='homestay/:homeID' component={Homestay} />
            <Route path='host-international-students' component={AbroadwithForHosts} />

            <Route onEnter={requireLogin}>
              <Route path='book-course' onEnter={requirePotentialCourseBooking} getComponent={getBookCourse} />
              <Route path='book-course/success' getComponent={getBookCourseSuccess} />
              <Route path='book-homestay' onEnter={requirePotentialHomestayBooking} getComponent={getBookHomestay} />
              <Route path='book-homestay/success' getComponent={getBookHomestaySuccess} />
              <Route path='edit-profile' getComponent={getUserProfileEdit} />
              <Route path='inbox' getComponent={getInbox} />
              <Route path='invite' getComponent={getInvite} />
              <Route path='invoice/course/student/:invoiceID' getComponent={getInvoiceCourse} />
              <Route path='invoice/homestay/host/:invoiceID' getComponent={getInvoiceHomestay} />
              <Route path='invoice/homestay/student/:invoiceID' getComponent={getInvoiceHomestay} />
              <Route path='login-success' component={LoginSuccess} />
              <Route path='manage-home' getComponent={getManageHomeLandingPage} onEnter={singleHomeRedirect} />
              <Route path='manage-home/:homeID' getComponent={getManageHome} />
              <Route path='receipt/course/student/:bookingID' getComponent={getReceiptCourse} />
              <Route path='receipt/homestay/host/:bookingID' getComponent={getReceiptHomestay} />
              <Route path='receipt/homestay/student/:bookingID' getComponent={getReceiptHomestay} />
              <Route path='reservations' getComponent={getReservations} />
              <Route path='reservation/:reservationID' getComponent={getReservationDetails} />
              <Route path='review' getComponent={getReview}>
                <Route path='educator/:educatorID' getComponent={getReviewEducator} />
                <Route path='home/:homeID' getComponent={getReviewHome} />
                <Route path='user/:userID' getComponent={getReviewUser} />
              </Route>
              <Route path='settings' getComponent={getSettings} />
              <Route path='thread/:threadID' getComponent={getThread} />
              <Route path='trips' getComponent={getTrips} />
              <Route path='verify/email' getComponent={getEmailVerification} />
            </Route>

            <Route
              path='language-homestay/search'
              onEnter={() => noFooterEnter(store)}
              onChange={() => noFooterEnter(store)}
              onLeave={() => noFooterLeave(store)}
              component={SearchHomestays}
            />

            <Route path='language-course' component={CourseLandingPage} />
            <Route
              path='language-course/search'
              onEnter={() => noFooterEnter(store)}
              onChange={() => noFooterEnter(store)}
              onLeave={() => noFooterLeave(store)}
              component={SearchCourses}
            />

            <Route path='language-school/:educatorID' component={School} />

            <Route path='login' component={LoginPage} />
            <Route path='popular-languages-destinations' component={PopularLanguages} />
            <Route path='privacy' getComponent={getPrivacyPolicy} />
            <Route path='reset-password-set' getComponent={getResetPassword} />
            <Route path='signup' component={SignupPage} />
            <Route path='terms' getComponent={getTermsAndConditions} />
            <Route path='user/:userID' component={UserProfile} />
            <Route path='testimonials' components={Testimonials} />

          </Route>
        )
      })}

      {/* Redirects for basepaths themselves */}
      {Object.values(UILanguages).map(locale => {
        return (
          <Redirect from={`/${locale.iso2}`} to={locale.basepath} key={locale.iso2} />
        )
      })}

      {/* Catchall for unmatched routes, returns 404 */}
      <Route path='*' component={App} status={404} />

    </span>
  )
}
