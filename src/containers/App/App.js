// Absolute imports
import { asyncConnect } from 'redux-async-connect'
import { connect } from 'react-redux'
import { Footer, Navigation } from 'components'
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth'
import { push } from 'react-router-redux'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'

// Relative imports
import config from '../../config'
import styles from './App.styles'

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => { // eslint-disable-line
    const promises = []

    if (!isAuthLoaded(getState())) {
      loadAuth()
    }

    return Promise.all(promises)
  },
}])
@connect(
  state => ({
    user: state.auth.user,
  }),
  { logout, pushState: push })
export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  state = {
    modals: {
      login: {
        open: false,
      },
    },
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess')
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/')
    }
  }

  openModal = (modalName) => {
    let newState = this.state // eslint-disable-line
    newState.modals[modalName].open = true
    this.setState(newState)
  }

  closeModal = (modalName) => {
    let newState = this.state // eslint-disable-line
    newState.modals[modalName].open = false
    this.setState(newState)
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  render() {

    const { user } = this.props

    return (
      <div style={styles.appContainer}>
        <Helmet {...config.app.head} />

        <Navigation user={user} title={config.app.title} />

        <div style={styles.appContent}>
          {this.props.children}
        </div>

        <Footer />

      </div>
    )
  }
}
