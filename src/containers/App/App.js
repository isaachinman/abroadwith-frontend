// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { Footer, Navbar } from 'components'
import { isLoaded as isAuthLoaded, logout } from 'redux/modules/auth'
import { push } from 'react-router-redux'
import { StyleRoot } from 'radium'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'
import NotFound from 'components/NotFound/NotFound'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
import VerifyEmailModal from 'components/Modals/VerifyEmailModal'
import VerifyPhoneModal from 'components/Modals/VerifyPhoneModal'
import config from 'config'

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
  //   Note that componentDidMount doesn't fire on the server
  //   So these requests will specifically wait to fire on the client,
  //   reducing http request load and other computation on the server
  // ------------------------------------------------------------------/
  componentDidMount = () => {

    const { dispatch, homes, token, user } = this.props

    // Load homes if necessary
    if (user.data && user.data.homeIds && homes.length !== user.data.homeIds.length) {
      user.data.homeIds.map(homeID => {
        if (!homes[homeID] || (homes[homeID] && !homes[homeID].loading && !homes[homeID].loaded)) {
          dispatch(loadHomestayWithAuth(token, homeID))
        }
      })
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
    if (token && !user.loaded && !user.loading) {
      dispatch(loadUserWithAuth(token))
    }
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  render() {

    const { jwt, user, route } = this.props

    return (
      <StyleRoot>
        <div style={styles.appContainer}>

          <Helmet {...config.app.head} />

          <Navbar jwt={jwt} user={user} title={config.app.title} />

          <div style={styles.appContent}>
            {route.status === 200 && this.props.children}
            {route.status === 404 && <NotFound />}
          </div>

          {user && user.data && user.data.verifications && !user.data.verifications.email &&
            <VerifyEmailModal />
          }
          {user && user.data && user.data.verifications && !user.data.verifications.phone &&
            <VerifyPhoneModal />
          }

          <Footer />

        </div>
      </StyleRoot>
    )
  }
}

App.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
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
