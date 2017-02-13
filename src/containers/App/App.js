// Absolute imports
import { asyncConnect } from 'redux-connect'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { deletePotentialHomestayBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import { Footer, LoadingBar, Navbar } from 'components'
import { isLoaded as isAuthLoaded, logout } from 'redux/modules/auth'
import { push } from 'react-router-redux'
import { StyleRoot } from 'radium'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import moment from 'moment'
import NotFound from 'components/NotFound/NotFound'
import notification from 'antd/lib/notification'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
import { loadCurrencyRates } from 'redux/modules/ui/currency'
import VerifyEmailModal from 'components/Modals/VerifyEmailModal'
import VerifyPhoneModal from 'components/Modals/VerifyPhoneModal'
import config from 'config'
import FadeProps from 'fade-props'

// Relative imports
import styles from './App.styles'

// Config for notification system
notification.config({ top: 100 })

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => { // eslint-disable-line

    const promises = []

    if (isAuthLoaded(getState())) {
      console.log('auth is loaded')
    }

    return Promise.all(promises)
  },
}])
@connect(
  state => ({
    bookings: state.bookings,
    currency: state.ui.currency,
    footer: state.ui.footer,
    jwt: state.auth.jwt,
    token: state.auth.token,
    user: state.privateData.user,
    homes: state.privateData.homes,
    routing: state.routing.locationBeforeTransitions,
    locale: state.ui.locale,
  }),
  { logout, pushState: push }
)
@translate()
export default class App extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  // Mostly used to keep track of notifications etc
  state = {
    potentialBookingReminderSent: false,
  }

  // -------------------------------------------------------------------/
  //   Note that componentDidMount doesn't call on the server
  //   So these requests will specifically wait to fire on the client,
  //   reducing http request load and other computation on the server
  // ------------------------------------------------------------------/
  componentDidMount = () => {

    const { currency, dispatch, homes, token, user } = this.props

    // Load homes if necessary
    if (user.data && user.data.homeIds && homes.length !== user.data.homeIds.length) {
      user.data.homeIds.map(homeID => {
        if (!homes[homeID] || (homes[homeID] && !homes[homeID].loading && !homes[homeID].loaded)) {
          dispatch(loadHomestayWithAuth(token, homeID))
        }
      })
    }

    // Load currency rates if for some reason it didn't happen in SSR
    if (!currency.exchangeRates.loaded || !currency.exchangeRates.data) {
      dispatch(loadCurrencyRates())
    }

  }

  componentWillReceiveProps(nextProps) {

    if (!this.props.jwt && nextProps.jwt) {

      // Login just happened
      const jwt = nextProps.jwt
      localStorage.setItem('jwt', JSON.stringify(jwt))

    } else if (this.props.jwt && !nextProps.jwt) {

      // Logout just happened
      this.props.pushState('/')

    }

  }

  componentDidUpdate = () => {

    const { dispatch, token, user } = this.props

    // Load user if necessary (sometimes happens in weird edge cases)
    if (token && !user.loaded && !user.loading && !user.error) {
      dispatch(loadUserWithAuth(token))
    }

    // Remind user about potential bookings
    const { bookings, router, t } = this.props

    if (!this.state.potentialBookingReminderSent &&
        bookings.homestayBookings.potentialBooking.stayId &&
        moment().subtract(1, 'hours') > moment(bookings.homestayBookings.potentialBookingHelpers.createdAt) &&
        !router.getCurrentLocation().pathname.includes('book-homestay')
      ) {

      this.setState({ potentialBookingReminderSent: true })

      // Trigger notification on timeout after a few seconds
      console.log('inside condition', this)
      console.log('pathname: ', router.getCurrentLocation())
      console.log('location: ', location.pathname.includes('book-homestay'))
      setTimeout(() => {

        const toBooking = () => {
          dispatch(push('/book-homestay'))
          notification.close('potentialBookingReminder')
        }

        const deleteBooking = () => {
          dispatch(deletePotentialHomestayBooking())
          notification.close('potentialBookingReminder')
        }

        const btn = (
          <div style={{ textAlign: 'right', marginBottom: -10 }}>
            <Button onClick={toBooking} bsSize='xsmall' bsStyle='success' style={{ fontSize: 12 }}>{t('common.notifications.incomplete_homestay_booking.button')}</Button>
            <div>
              <a onClick={deleteBooking} style={{ fontSize: 10 }}>Delete booking</a>
            </div>
          </div>
        )

        notification.warning({
          key: 'potentialBookingReminder',
          duration: 0,
          message: <strong>{t('common.notifications.incomplete_homestay_booking.title')}</strong>,
          description: t('common.notifications.incomplete_homestay_booking.description'),
          btn,
        })

      }, 3000)
    }

  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  render() {

    const { footer, jwt, user, route, routing } = this.props

    return (
      <StyleRoot>
        <div style={styles.appContainer}>

          <Helmet {...config.app.head} />

          <LoadingBar />
          <Navbar jwt={jwt} user={user} title={config.app.title} />

          <FadeProps animationLength={40}>
            <main style={styles.appContent} key={routing.pathname}>
              {route.status === 200 && this.props.children}
              {route.status === 404 && <NotFound />}
            </main>
          </FadeProps>


          {user && user.data && user.data.verifications && !user.data.verifications.email &&
            <VerifyEmailModal />
          }
          {user && user.data && user.data.verifications && !user.data.verifications.phone &&
            <VerifyPhoneModal />
          }

          {!footer.hidden &&
            <Footer />
          }

        </div>
      </StyleRoot>
    )
  }
}

App.propTypes = {
  bookings: PropTypes.object,
  children: PropTypes.object,
  currency: PropTypes.object,
  dispatch: PropTypes.func,
  footer: PropTypes.object,
  homes: PropTypes.object,
  jwt: PropTypes.object,
  user: PropTypes.object,
  locale: PropTypes.object,
  logout: PropTypes.func,
  params: PropTypes.object,
  pushState: PropTypes.func,
  route: PropTypes.object,
  router: PropTypes.object,
  routing: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
