// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { Footer, LoadingBar, Navbar } from 'components'
import { isLoaded as isAuthLoaded, logout } from 'redux/modules/auth'
import { push } from 'react-router-redux'
import { StyleRoot } from 'radium'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'
import NotFound from 'components/NotFound/NotFound'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
import { loadCurrencyRates } from 'redux/modules/ui/currency'
import VerifyEmailModal from 'components/Modals/VerifyEmailModal'
import VerifyPhoneModal from 'components/Modals/VerifyPhoneModal'
import config from 'config'
import FadeProps from 'fade-props'

// Relative imports
import styles from './App.styles'

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
export default class App extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired,
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
  routing: PropTypes.object,
  token: PropTypes.string,
}
