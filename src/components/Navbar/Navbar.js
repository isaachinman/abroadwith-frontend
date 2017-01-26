// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Login, Logo, Signup } from 'components'
import { Modal, Navbar as BootstrapNavbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { logout } from 'redux/modules/auth'
import FontAwesome from 'react-fontawesome'
import Radium from 'radium'
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
@Radium
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

    const { dispatch, jwt, user, t, token } = this.props

    const hostUI = jwt && user && user.data && user.data.homeIds.length > 0
    const guestUI = jwt ? !hostUI : false

    return (
      <span style={styles.navbarContainer}>
        <BootstrapNavbar
          collapseOnSelect
          fixedTop
          onToggle={navExpanded => this.setState({ navExpanded })}
        >
          <BootstrapNavbar.Header>
            <BootstrapNavbar.Brand>
              <IndexLink to='/'>
                <Logo size={148} color='blue' />
              </IndexLink>
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle><FontAwesome name={this.state.navExpanded ? 'caret-up' : 'caret-down'} /></BootstrapNavbar.Toggle>
          </BootstrapNavbar.Header>

          <BootstrapNavbar.Collapse>

            {/* Desktop logged-out navbar */}
            {!jwt &&
              <span style={styles.desktopNavbar}>
                <Nav navbar pullRight>
                  <NavItem onClick={memobind(this, 'openModal', 'hostSignup')}>{t('common.navbar_become_host')}</NavItem>
                  <NavItem onClick={memobind(this, 'openModal', 'studentSignup')}>{t('common.navbar_sign_up')}</NavItem>
                  <NavItem onClick={memobind(this, 'openModal', 'login')}>{t('common.navbar_login')}</NavItem>
                </Nav>
              </span>
            }

            {/* Desktop logged-in navbar */}
            {jwt &&
              <span style={styles.desktopNavbar}>
                <Nav navbar pullRight>
                  {hostUI &&
                  <LinkContainer to='/manage-home'>
                    {user.data.homeIds.length > 1 ? <NavItem>{t('common.navbar_your_homes')}</NavItem> : <NavItem>{t('common.navbar_your_home')}</NavItem>}
                  </LinkContainer>
                      }
                  {guestUI &&
                  <NavItem onClick={() => dispatch(createHomestay(token, true))}>{t('common.navbar_become_host')}</NavItem>
                      }
                  <LinkContainer to='/inbox'>
                    <NavItem>
                      <FontAwesome name='envelope-o' />
                    </NavItem>
                  </LinkContainer>
                  <NavDropdown title={user.loaded ? user.data.firstName : jwt.name} id='nav-dropdown'>
                    <LinkContainer to={`/user/${jwt.rid}`}>
                      <MenuItem>{t('common.navbar_profile')}</MenuItem>
                    </LinkContainer>
                    {hostUI &&
                    <LinkContainer to='/reservations'>
                      <NavItem>{t('common.navbar_reservations')}</NavItem>
                    </LinkContainer>
                        }
                    {guestUI &&
                    <LinkContainer to='/trips'>
                      <NavItem>{t('common.navbar_your_trips')}</NavItem>
                    </LinkContainer>
                        }
                    <LinkContainer to='/invite'>
                      <MenuItem>{t('common.navbar_invite')}</MenuItem>
                    </LinkContainer>
                    <LinkContainer to='/settings'>
                      <MenuItem>{t('common.navbar_settings')}</MenuItem>
                    </LinkContainer>
                    <MenuItem divider />
                    <MenuItem onSelect={this.handleLogout}>
                      {t('common.navbar_logout')}
                    </MenuItem>
                  </NavDropdown>
                </Nav>
              </span>
            }

            {/* Mobile logged out navbar */}
            {!jwt &&
              <span style={styles.mobileNavbar}>
                <Nav>
                  <NavItem onClick={memobind(this, 'openModal', 'hostSignup')}>{t('common.navbar_become_host')}</NavItem>
                  <NavItem onClick={memobind(this, 'openModal', 'studentSignup')}>{t('common.navbar_sign_up')}</NavItem>
                  <NavItem onClick={memobind(this, 'openModal', 'login')}>{t('common.navbar_login')}</NavItem>
                </Nav>
              </span>
            }

            {/* Mobile logged-in navbar */}
            {jwt &&
              <span style={styles.mobileNavbar}>
                <Nav>
                  {hostUI &&
                  <LinkContainer to='/manage-home'>
                    {user.data.homeIds.length > 1 ? <NavItem>{t('common.navbar_your_homes')}</NavItem> : <NavItem>{t('common.navbar_your_home')}</NavItem>}
                  </LinkContainer>
                      }
                  {guestUI &&
                  <NavItem onClick={() => dispatch(createHomestay(token, true))}>{t('common.navbar_become_host')}</NavItem>
                      }
                  <LinkContainer to='/inbox'>
                    <NavItem>{t('inbox.title')}</NavItem>
                  </LinkContainer>
                  <LinkContainer to={`/user/${jwt.rid}`}>
                    <NavItem>{t('common.navbar_profile')}</NavItem>
                  </LinkContainer>
                  {hostUI &&
                  <LinkContainer to='/reservations'>
                    <NavItem>{t('common.navbar_reservations')}</NavItem>
                  </LinkContainer>
                      }
                  {guestUI &&
                  <LinkContainer to='/trips'>
                    <NavItem>{t('common.navbar_your_trips')}</NavItem>
                  </LinkContainer>
                      }
                  <LinkContainer to='/invite'>
                    <NavItem>{t('common.navbar_invite')}</NavItem>
                  </LinkContainer>
                  <LinkContainer to='/settings'>
                    <NavItem>{t('common.navbar_settings')}</NavItem>
                  </LinkContainer>
                  <NavItem onSelect={this.handleLogout}>
                    {t('common.navbar_logout')}
                  </NavItem>

                </Nav>
              </span>
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
