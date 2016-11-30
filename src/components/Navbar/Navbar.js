// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Login, Logo } from 'components'
import { Modal, Navbar as BootstrapNavbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import * as authActions from 'redux/modules/auth'
import memobind from 'memobind'

// Relative imports
import styles from './Navbar.styles'

@connect(() => authActions)
export default class Navbar extends Component {

  state = {
    modals: {
      login: {
        open: false,
      },
      hostSignup: {
        open: false,
      },
      studentSignup: {
        open: false,
      },
    },
  }

  handleLogout = () => {
    const { dispatch, logout } = this.props
    dispatch(logout())
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

  render() {

    const { jwt, title } = this.props

    return (
      <span>
        <BootstrapNavbar fixedTop>
          <BootstrapNavbar.Header>
            <BootstrapNavbar.Brand>
              <IndexLink to='/'>
                <span style={styles.brandname}>{title}</span>
                <Logo size={25} color='blue' componentStyle={styles.brand} />
              </IndexLink>
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle />
          </BootstrapNavbar.Header>

          <BootstrapNavbar.Collapse>

            {!jwt &&
              <Nav navbar pullRight>
                <NavItem onClick={memobind(this, 'openModal', 'hostSignup')}>Become a host</NavItem>
                <NavItem onClick={memobind(this, 'openModal', 'studentSignup')}>Student sign up</NavItem>
                <NavItem onClick={memobind(this, 'openModal', 'login')}>Login</NavItem>
              </Nav>
            }

            {jwt &&
              <Nav navbar pullRight>
                <NavDropdown title={jwt.name} id='nav-dropdown'>
                  <LinkContainer to='/homestay/132'>
                    <MenuItem>To homestay 132</MenuItem>
                  </LinkContainer>

                  <LinkContainer to='/homestay/403'>
                    <MenuItem>To homestay 403</MenuItem>
                  </LinkContainer>

                  <LinkContainer to='/homestay/409'>
                    <MenuItem>To homestay 409</MenuItem>
                  </LinkContainer>

                  <LinkContainer to='/users/389'>
                    <MenuItem>To a user profile</MenuItem>
                  </LinkContainer>

                  <MenuItem divider />
                  <MenuItem onSelect={this.handleLogout}>
                    <div className='logout-link'>
                      Logout
                    </div>
                  </MenuItem>
                </NavDropdown>
              </Nav>
            }

          </BootstrapNavbar.Collapse>
        </BootstrapNavbar>

        <Modal
          bsSize='small'
          onHide={memobind(this, 'closeModal', 'login')}
          show={this.state.modals.login.open}
        >
          <Login compact />
        </Modal>

        <Modal
          onHide={memobind(this, 'closeModal', 'studentSignup')}
          show={this.state.modals.studentSignup.open}
        >
          Student signup
        </Modal>

        <Modal
          onHide={memobind(this, 'closeModal', 'hostSignup')}
          show={this.state.modals.hostSignup.open}
        >
          Host signup
        </Modal>

      </span>
    )

  }

}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  jwt: PropTypes.object,
  logout: PropTypes.func,
  dispatch: PropTypes.func,
}
