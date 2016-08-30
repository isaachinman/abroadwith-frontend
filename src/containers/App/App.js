// Absolute imports
import { asyncConnect } from 'redux-async-connect'
import { connect } from 'react-redux'
import { Footer, Navigation } from 'components'
import { isLoaded as isAuthLoaded, logout } from 'redux/modules/auth'
import { push } from 'react-router-redux'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'

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
  }),
  { logout, pushState: push }
)
export default class App extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.jwt && nextProps.jwt) {

      // Login just happened
      localStorage.setItem('jwt', JSON.stringify(nextProps.jwt))
      console.log('LOAD FULL USER HERE')

    } else if (this.props.jwt && !nextProps.jwt) {
      // Logout just happened
      this.props.pushState('/')
    }
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  render() {

    const { jwt } = this.props

    return (
      <div style={styles.appContainer}>

        <Helmet {...config.app.head} />

        <Navigation jwt={jwt} title={config.app.title} />

        <div style={styles.appContent}>
          {this.props.children}
        </div>

        <Footer />

      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  jwt: PropTypes.object,
  logout: PropTypes.func,
  pushState: PropTypes.func,
}
