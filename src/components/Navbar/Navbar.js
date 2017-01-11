// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Login, Logo, Signup } from 'components'
import { Modal, Navbar as BootstrapNavbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { logout } from 'redux/modules/auth'
import FontAwesome from 'react-fontawesome'
import { createHomestay } from 'redux/modules/privateData/homes/homeManagement'
import memobind from 'memobind'
import { translate } from 'react-i18next'

// Relative imports
import styles from './Navbar.styles'

@connect(state => ({
  jwt: state.auth.jwt,
  token: state.auth.token,
}))
@translate()
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
    this.props.dispatch(logout())
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

    const { dispatch, jwt, user, t, token, title } = this.props

    console.log(this)

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
                <NavItem onClick={memobind(this, 'openModal', 'hostSignup')}>{t('common.navbar_become_host')}</NavItem>
                <NavItem onClick={memobind(this, 'openModal', 'studentSignup')}>{t('common.navbar_sign_up')}</NavItem>
                <NavItem onClick={memobind(this, 'openModal', 'login')}>{t('common.navbar_login')}</NavItem>
              </Nav>
            }

            {jwt &&
              <Nav navbar pullRight>
                {user.homeIds.length > 0 ?
                  <LinkContainer to='/manage-home'>
                    <NavItem>{t('common.navbar_your_home')}</NavItem>
                  </LinkContainer>
                  :
                  <NavItem onClick={() => dispatch(createHomestay(token))}>{t('common.navbar_become_host')}</NavItem>
                }
                <LinkContainer to='/inbox'>
                  <NavItem>
                    <FontAwesome name='envelope-o' />
                  </NavItem>
                </LinkContainer>
                <NavDropdown title={user ? user.firstName : jwt.name} id='nav-dropdown'>
                  <LinkContainer to='/settings'>
                    <MenuItem>{t('common.navbar_settings')}</MenuItem>
                  </LinkContainer>
                  <LinkContainer to='/manage-home'>
                    <MenuItem>{t('common.navbar_your_home')}</MenuItem>
                  </LinkContainer>
                  <LinkContainer to='/homestay/132'>
                    <NavItem>
                      Homestay
                    </NavItem>
                  </LinkContainer>
                  <LinkContainer to='/users/389'>
                    <NavItem>
                      User profile
                    </NavItem>
                  </LinkContainer>
                  <MenuItem divider />
                  <MenuItem onSelect={this.handleLogout}>
                    {t('common.navbar_logout')}
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
          <Signup type={'STUDENT'} />
        </Modal>

        <Modal
          onHide={memobind(this, 'closeModal', 'hostSignup')}
          show={this.state.modals.hostSignup.open}
        >
          <Signup type={'HOST'} />
        </Modal>

      </span>
    )

  }

}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  jwt: PropTypes.object,
  token: PropTypes.string,
  logout: PropTypes.func,
  dispatch: PropTypes.func,
  user: PropTypes.object,
  t: PropTypes.func,
}
