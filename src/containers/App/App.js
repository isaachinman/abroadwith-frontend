import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { logout } from 'redux/modules/auth'
import { Logo } from 'components'
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
  state => ({ user: state.auth.user }),
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

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess')
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/')
    }
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  };

  render() {

    const { user } = this.props

    return (
      <div>
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
              <LinkContainer to='/login'>
                <NavItem eventKey={5}>Login</NavItem>
              </LinkContainer>}
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

        <div style={styles.appContent}>
          {this.props.children}
        </div>

      </div>
    )
  }
}
