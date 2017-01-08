// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { Footer, Navbar } from 'components'
import { isLoaded as isAuthLoaded, logout } from 'redux/modules/auth'
import { push } from 'react-router-redux'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'
import NotFound from 'components/NotFound/NotFound'
import UILanguages from 'data/constants/UILanguages'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'

// Relative imports
import config from '../../config'
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
    user: state.privateData.user.loaded ? state.privateData.user.data : null,
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

  state = {
    times: 0,
  }

  componentWillMount = () => {
    this.checkLocale()
  }

  // -------------------------------------------------------------------/
  //   Note that componentDidMount doesn't fire on the server
  //   So these requests will specifically wait to fire on the client,
  //   reducing http request load and other computation on the server
  // ------------------------------------------------------------------/
  componentDidMount = () => {

    const { dispatch, homes, token, user } = this.props

    // Load homes if necessary
    if (user && user.homeIds && homes.length !== user.homeIds.length) {
      user.homeIds.map(homeID => {
        if (!homes[homeID] || (homes[homeID] && !homes[homeID].loading && !homes[homeID].loaded)) {
          dispatch(loadHomestayWithAuth(token, homeID))
        }
      })
    }

  }

  componentWillReceiveProps(nextProps) {

    this.checkLocale()

    if (!this.props.jwt && nextProps.jwt) {

      // Login just happened
      const jwt = nextProps.jwt
      localStorage.setItem('jwt', JSON.stringify(jwt))

    } else if (this.props.jwt && !nextProps.jwt) {

      // Logout just happened
      this.props.pushState('/')

    }

  }

  checkLocale = () => {

    if (__CLIENT__) {
      const { dispatch, locale, route, routing } = this.props

      console.log(locale.value, route.locale.iso2)
      console.log('locale: ', locale)

      // Check to see if the cookie-stored locale matches the url
      if (!locale.loading && locale.loaded && route.locale && locale.value !== route.locale.iso2 && this.state.times < 10) {

        const times = this.state.times + 1
        this.setState({ times })
        dispatch(push(routing.pathname.replace(`${route.locale.basepath}`, `${UILanguages[locale.value].basepath}`)))

        console.log('locales dont match')
      } else {
        console.log('locales match')
      }
    }
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  render() {

    const { jwt, user, route } = this.props

    return (
      <div style={styles.appContainer}>

        <Helmet {...config.app.head} />

        <Navbar jwt={jwt} user={user} title={config.app.title} />

        <div style={styles.appContent}>
          {route.status === 200 && this.props.children}
          {route.status === 404 && <NotFound />}
        </div>

        <Footer />

      </div>
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
