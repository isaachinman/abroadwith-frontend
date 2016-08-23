// Absolute imports
import React, { PropTypes } from 'react'
import { IndexLink } from 'react-router'
import { Login, Logo } from 'components'
import { Modal, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import memobind from 'memobind'

// Relative imports
import styles from './Navigation.styles'

export default function Navigation(props) {

  const { user, title } = props

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
            {!user &&
              <NavItem onClick={memobind(this, 'openModal', 'login')}>Login</NavItem>
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
        onHide={memobind(this, 'closeModal', 'login')}
        show={this.state.modals.login.open}
      >
        <Login compact />
      </Modal>
    </span>
  )

}

Navigation.propTypes = {
  title: PropTypes.string.isRequired,
  user: PropTypes.object,
}
