// Absolute imports
import { asyncConnect } from 'redux-async-connect'
import { connect } from 'react-redux'
import { Footer, Login, Logo } from 'components'
import { IndexLink } from 'react-router'
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth'
import { Modal, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
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
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to='/'>
                <span style={styles.brandname}>{config.app.title}</span>
                <Logo size={25} color='blue' componentStyle={styles.brand} />
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav navbar pullRight>
              {!user &&
                <NavItem onClick={this.openModal.bind(null, 'login')}>Login</NavItem>
              }
              {user &&
                <NavDropdown title={user.name} id='nav-dropdown'>
                  <MenuItem>Action</MenuItem>
                  <MenuItem>Another action</MenuItem>
                  <MenuItem>Something else here</MenuItem>
                  <MenuItem divider />
                  <MenuItem>
                    <div className='logout-link' onClick={this.handleLogout}>
                      Logout
                    </div>
                  </MenuItem>
                </NavDropdown>
              }

            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Modal
          style={styles.loginModal}
          bsSize='small'
          onHide={this.openModal.bind(null, 'login')}
          show={this.state.modals.login.open}
        >
          <Login compact />
        </Modal>

        <div style={styles.appContent}>
          {this.props.children}
        </div>

        <Footer />

      </div>
    )
  }
}
