// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Col, Grid, Row, Nav, NavItem, Tab } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
import ContactInfo from 'components/ContactInfo/ContactInfo'
import debounce from 'debounce'

// Relative imports
import styles from './Settings.styles.js'

@connect(state => ({
  user: state.privateData.user.data,
  jwt: state.auth.jwt,
  token: state.auth.token,
}))
@translate()
export default class Settings extends Component {

  updateUser = newObject => {
    const { dispatch, jwt, token } = this.props

    const throttledUpdate = () => {
      dispatch(updateUser(jwt.rid, newObject, token, dispatch))
    }

    // Debounce the actual update so we make API calls at a reasonable rate
    debounce(throttledUpdate, 5000)

  }

  render() {

    const { t } = this.props

    return (
      <div>

        <Helmet title={t('admin.title')} />

        <Grid>
          <Tab.Container id='left-tabs-example' defaultActiveKey='contact-info'>
            <Row style={styles.mainRow}>
              <Col style={styles.sidebar} xs={12} sm={4} md={3} lg={2}>
                <Nav bsStyle='pills' stacked>
                  <NavItem eventKey='contact-info' style={styles.tabItem}>{t('admin.contact_info_tabname')}</NavItem>
                  <NavItem eventKey='languages' style={styles.tabItem}>{t('admin.languages_tabname')}</NavItem>
                  <NavItem eventKey='notifications' style={styles.tabItem}>{t('admin.notifications_tabname')}</NavItem>
                  <NavItem eventKey='payments' style={styles.tabItem}>{t('admin.payments_tabname')}</NavItem>
                  <NavItem eventKey='privacy-security' style={styles.tabItem}>{t('admin.privacy_tabname')}</NavItem>
                  <NavItem eventKey='verifications' style={styles.tabItem}>{t('admin.verifications_tabname')}</NavItem>
                </Nav>
              </Col>
              <Col style={styles.mainPanel} xs={12} sm={8} md={9} lg={10}>
                <Tab.Content animation>

                  <Tab.Pane eventKey='contact-info'>
                    <ContactInfo {...this.props} updateUser={this.updateUser} />
                  </Tab.Pane>

                  <Tab.Pane eventKey='languages'>
                    Manage Languages Module
                  </Tab.Pane>
                  <Tab.Pane eventKey='notifications'>
                    Couple of check boxes for notifications
                  </Tab.Pane>
                  <Tab.Pane eventKey='payments'>
                    Manage Payments Module
                  </Tab.Pane>
                  <Tab.Pane eventKey='privacy-security'>
                    Couple of buttons for privacy security
                  </Tab.Pane>
                  <Tab.Pane eventKey='verifications'>
                    Manage verifications Module
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Grid>

      </div>
    )
  }
}

Settings.propTypes = {
  jwt: PropTypes.object,
  dispatch: PropTypes.func,
  t: PropTypes.func,
  user: PropTypes.object,
  token: PropTypes.string,
}
