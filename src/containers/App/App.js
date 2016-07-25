import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info'
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth'
import { InfoBar, Logo } from 'components'
import { push } from 'react-router-redux'
import config from '../../config'
import { asyncConnect } from 'redux-async-connect'

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = []

    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()))
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()))
    }

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
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

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
    const styles = require('./App.scss')

    console.log(styles.app)

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to='/'>
                <span className={styles.brandname}>{config.app.title}</span>
                <Logo size={25} color='blue' componentClass={styles.brand} />
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar pullRight>
              {user && <LinkContainer to='/chat'>
                <NavItem eventKey={1}>Chat</NavItem>
              </LinkContainer>}

              <LinkContainer to='/widgets'>
                <NavItem eventKey={2}>Widgets</NavItem>
              </LinkContainer>
              <LinkContainer to='/survey'>
                <NavItem eventKey={3}>Survey</NavItem>
              </LinkContainer>
              <LinkContainer to='/about'>
                <NavItem eventKey={4}>About Us</NavItem>
              </LinkContainer>

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

        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <InfoBar />

      </div>
    )
  }
}
