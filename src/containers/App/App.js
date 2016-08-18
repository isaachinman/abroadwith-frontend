import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { Modal, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { logout } from 'redux/modules/auth'
import { Footer, Login, Logo } from 'components'
import { push } from 'react-router-redux'
import config from '../../config'
import { asyncConnect } from 'redux-async-connect'
import styles from './App.styles'

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => { // eslint-disable-line
    const promises = []

    // if (!isAuthLoaded(getState())) {
    //   loadAuth()
    // }

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

          <Navbar.Collapse eventKey={0}>
            <Nav navbar pullRight>
              {!user &&
              <NavItem eventKey={5} onClick={this.openModal.bind(null, 'login')}>Login</NavItem>
              }
              {user &&
              <NavDropdown eventKey='7' title={user.name} id='nav-dropdown'>
                <MenuItem eventKey='7.1'>Action</MenuItem>
                <MenuItem eventKey='7.2'>Another action</MenuItem>
                <MenuItem eventKey='7.3'>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey='7.4'>
                  <div eventKey={6} className='logout-link' onClick={this.handleLogout}>
                    Logout
                  </div>
                </MenuItem>
              </NavDropdown>}

            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Modal
          style={styles.loginModal}
          bsSize='small'
          onHide={this.closeModal.bind(null, 'login')}
          show={this.state.modals.login.open}
        >
          <Login compact/>
        </Modal>

        <div style={styles.appContent}>
          {this.props.children}
        </div>

        <Footer/>

      </div>
    )
  }
}
