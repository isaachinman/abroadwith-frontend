// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createHomestay } from 'redux/modules/privateData/homes/homeManagement'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Login, Logo, Signup } from 'components'
import { Badge, Modal, Navbar as BootstrapNavbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { logout } from 'redux/modules/auth'
import FontAwesome from 'react-fontawesome'
import Radium from 'radium'
import { closeLoginModal, closeStudentSignupModal, closeHostSignupModal } from 'redux/modules/ui/modals'
import { translate } from 'react-i18next'

// Relative imports
import styles from './Navbar.styles'

@connect(state => ({
  homeManagement: state.privateData.homeManagement,
  jwt: state.auth.jwt,
  unreadMessageCount: state.unreadMessageCount,
  token: state.auth.token,
  modals: state.ui.modals,
}))
@translate()
@Radium
export default class Navbar extends Component {

  createHomestay = () => {

    const { dispatch, homeManagement, token } = this.props

    if (!homeManagement.loading) {
      dispatch(createHomestay(token, true))
    }

  }

  handleLogout = () => {
    this.props.dispatch(logout())
  }

  render() {

    const { homeManagement, jwt, modals, unreadMessageCount, user, t } = this.props

    const hostUI = jwt && user && user.data && user.data.feUserType.indexOf('HOST') > -1
    const guestUI = jwt && user && user.data && user.data.feUserType.indexOf('STUDENT') > -1

    return (
      <span style={styles.navbarContainer}>
        <BootstrapNavbar
          collapseOnSelect
          fixedTop
          onToggle={navExpanded => this.setState({ navExpanded })}
        >
          <BootstrapNavbar.Header>
            <BootstrapNavbar.Brand>
              <div style={styles.brand}>
                <IndexLink to='/' tabIndex={-1}>
                  <Logo size={148} color='blue' />
                </IndexLink>
              </div>
            </BootstrapNavbar.Brand>
            <div style={styles.mobileToggle}>
              <BootstrapNavbar.Toggle>
                <FontAwesome size='2x' name={this.state.navExpanded ? 'caret-up' : 'bars'} />
              </BootstrapNavbar.Toggle>
            </div>
          </BootstrapNavbar.Header>

          <BootstrapNavbar.Collapse>

            {/* Desktop logged-out navbar */}
            {!jwt &&
              <span style={styles.desktopNavbar}>
                <Nav navbar pullRight>
                  <NavItem>{t('common.navbar_become_host')}</NavItem>
                  <NavItem>{t('common.navbar_sign_up')}</NavItem>
                  <NavItem>{t('common.navbar_login')}</NavItem>
                </Nav>
              </span>
            }

            {/* Desktop logged-in navbar */}
            {jwt &&
              <span style={styles.desktopNavbar}>
                <Nav navbar pullRight>
                  {hostUI && user.data.homeIds.length > 0 &&
                    <LinkContainer to='/manage-home'>
                      {user.data.homeIds.length > 1 ? <NavItem>{t('common.navbar_your_homes')}</NavItem> : <NavItem>{t('common.navbar_your_home')}</NavItem>}
                    </LinkContainer>
                  }
                  {((guestUI && !hostUI) || (hostUI && user.data.homeIds.length === 0)) &&
                    <NavItem onClick={this.createHomestay} disabled={homeManagement.loading}>{homeManagement.loading ? t('common.Loading') : t('common.navbar_become_host')}</NavItem>
                  }
                  <LinkContainer to='/inbox'>
                    <NavItem>
                      <FontAwesome name='envelope-o' />
                      {unreadMessageCount.loaded && unreadMessageCount.unreadCount.count > 0 &&
                        <Badge style={styles.unreadCountBadge}>{unreadMessageCount.unreadCount.count}</Badge>
                      }
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
                  <NavItem>{t('common.navbar_become_host')}</NavItem>
                  <NavItem>{t('common.navbar_sign_up')}</NavItem>
                  <NavItem>{t('common.navbar_login')}</NavItem>
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
                  {((guestUI && !hostUI) || (hostUI && user.data.homeIds.length === 0)) &&
                    <NavItem onClick={this.createHomestay} disabled={homeManagement.loading}>{homeManagement.loading ? t('common.Loading') : t('common.navbar_become_host')}</NavItem>
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
          onHide={() => this.props.dispatch(closeLoginModal())}
          show={modals.loginModal.open}
        >
          <Login compact />
        </Modal>

        <Modal
          onHide={() => this.props.dispatch(closeStudentSignupModal())}
          show={modals.studentSignupModal.open}
        >
          <Signup type={'STUDENT'} />
        </Modal>

        <Modal
          onHide={() => this.props.dispatch(closeHostSignupModal())}
          show={modals.hostSignupModal.open}
        >
          <Signup type={'HOST'} />
        </Modal>

      </span>
    )

  }

}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  homeManagement: PropTypes.object,
  jwt: PropTypes.object,
  token: PropTypes.string,
  logout: PropTypes.func,
  dispatch: PropTypes.func,
  modals: PropTypes.object,
  unreadMessageCount: PropTypes.object,
  user: PropTypes.object,
  t: PropTypes.func,
}
