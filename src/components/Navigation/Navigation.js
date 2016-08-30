// Absolute imports
import React, { Component, PropTypes } from 'react'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Login, Logo } from 'components'
import { Modal, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import memobind from 'memobind'

// Relative imports
import styles from './Navigation.styles'

export default class Navigation extends Component {

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
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to='/'>
                <span style={styles.brandname}>{title}</span>
                <Logo size={25} color='blue' componentStyle={styles.brand} />
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav navbar pullRight>
              {!jwt &&
                <NavItem onClick={memobind(this, 'openModal', 'login')}>Login</NavItem>
              }
              {jwt &&
                <NavDropdown title={jwt.name} id='nav-dropdown'>

                  <LinkContainer to='/homestay/132'>
                    <MenuItem>To a homestay</MenuItem>
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
          </Navbar.Collapse>
        </Navbar>

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

Navigation.propTypes = {
  title: PropTypes.string.isRequired,
  jwt: PropTypes.object,
}
