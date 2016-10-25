// Absolute imports
import React, { Component, PropTypes } from 'react'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Login, Logo } from 'components'
import { Modal, Navbar as BootstrapNavbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import memobind from 'memobind'

// Relative imports
import styles from './Navbar.styles'

export default class Navbar extends Component {

  state = {
    modals: {
      login: {
        open: false,
      },
    },
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
            <Nav navbar pullRight>
              {!jwt &&
                <NavItem onClick={memobind(this, 'openModal', 'login')}>Login</NavItem>
              }
              {jwt &&
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
                  <MenuItem>
                    <div className='logout-link' onClick={this.handleLogout}>
                      Logout
                    </div>
                  </MenuItem>
                </NavDropdown>
              }

            </Nav>
          </BootstrapNavbar.Collapse>
        </BootstrapNavbar>

        <Modal
          style={styles.loginModal}
          bsSize='small'
          onHide={memobind(this, 'closeModal', 'login')}
          show={this.state.modals.login.open}
        >
          <Login compact />
        </Modal>
      </span>
    )

  }

}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  jwt: PropTypes.object,
}
