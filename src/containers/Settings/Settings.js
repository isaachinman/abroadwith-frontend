// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Button, Col, Grid, Row, Nav, NavItem, Tab } from 'react-bootstrap'
import Helmet from 'react-helmet'
import i18n from 'i18n/i18n-client'
import { update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
import shortid from 'shortid'
import debounce from 'debounce'
import doesNotHaveIDs from 'utils/languages/does-not-have-ids'
import filterLanguageArray from 'utils/languages/filter-language-array'

// Components
import ContactInfo from 'components/ContactInfo/ContactInfo'
import ManageLanguages from 'components/ManageLanguages/ManageLanguages'
import ManageNotifications from 'components/ManageNotifications/ManageNotifications'
import ManageSecurity from 'components/ManageSecurity/ManageSecurity'
import ManageVerifications from 'components/ManageVerifications/ManageVerifications'
import PaymentMethods from 'components/PaymentMethods/PaymentMethods'
import PayoutMethods from 'components/PayoutMethods/PayoutMethods'

// Relative imports
import styles from './Settings.styles.js'

@connect(state => ({
  user: state.privateData.user.data,
  jwt: state.auth.jwt,
  token: state.auth.token,
  uiLanguage: state.ui.locale.value,
}))
@translate()
export default class Settings extends Component {

  state = {
    knownLanguages: this.props.user.userKnownLanguages.map(language => Object.assign({}, language, { id: shortid() })),
    learningLanguages: this.props.user.userLearningLanguages.map(language => Object.assign({}, language, { id: shortid() })),
  }

  componentWillReceiveProps = nextProps => {

    // If languages don't have ids, reset the state with ids
    if (this.state.knownLanguages.some(doesNotHaveIDs)) {
      this.setState({
        knownLanguages: nextProps.user.userKnownLanguages.map(language => Object.assign({}, language, { id: shortid() })),
        learningLanguages: nextProps.user.userLearningLanguages.map(language => Object.assign({}, language, { id: shortid() })),
      })
    }

  }

  addLanguage = type => {
    this.setState({
      [`${type}Languages`]: this.state[`${type}Languages`].concat({
        id: shortid.generate(),
        language: null,
        level: null,
      }),
    })
  }

  removeLanguage = (type, id) => {
    this.setState({
      [`${type}Languages`]: this.state[`${type}Languages`].filter(lang => {
        return lang.id !== id
      }),
    }, () => this.saveLanguages())
  }

  updateLanguage = (type, id, data) => {

    const newArray = this.state[`${type}Languages`].map(language => {
      if (language.id !== id) {
        return language
      }
      return ({
        id,
        language: data.length > 0 ? data[0].id : null,
        level: data.length > 0 ? language.level : null,
      })
    })
    this.setState({ [`${type}Languages`]: newArray })

  }

  updateLanguageLevel = (type, id, eventKey) => {
    const newArray = this.state[`${type}Languages`].map(language => {
      if (language.id !== id) {
        return language
      }
      return ({
        id,
        language: language.language,
        level: eventKey,
      })
    })
    this.setState({ [`${type}Languages`]: newArray })
  }

  saveLanguages = () => {
    this.updateUser(Object.assign({}, this.props.user, {
      userKnownLanguages: filterLanguageArray(this.state.knownLanguages),
      userLearningLanguages: filterLanguageArray(this.state.learningLanguages),
    }))
  }

  updateUser = newObject => {
    const { dispatch, jwt, token } = this.props
    dispatch(updateUser(jwt.rid, newObject, token))
  }

  render() {

    const { uiLanguage, jwt, t } = this.props
    const { knownLanguages, learningLanguages } = this.state

    // Debounce autosave functionality to a reasonable rate
    const debouncedUpdateUser = debounce(this.updateUser, 1000)

    // Determine available languages
    const usedLanguages = learningLanguages.map(lang => lang.language).concat(knownLanguages.map(lang => lang.language)).filter(lang => lang !== null)
    const allLanguages = Object.entries(i18n.store.data[uiLanguage].translation.languages).map(([id, label]) => ({ id, label }))
    const availableLanguages = allLanguages.filter(lang => usedLanguages.indexOf(lang.id) === -1)

    return (
      <div>

        <Helmet title={t('admin.title')} />

        <Grid>
          <Row style={styles.h1Row}>
            <Col xs={12}>
              <h1>{t('admin.title')}</h1>
            </Col>
          </Row>
          <Tab.Container id='left-tabs-example' defaultActiveKey='contact-info'>
            <Row style={styles.mainRow}>
              <Col style={styles.sidebar} xs={12} sm={4} md={3} lg={2}>
                <Nav bsStyle='pills' stacked>
                  <NavItem eventKey='contact-info' style={styles.tabItem}>{t('admin.contact_info_tabname')}</NavItem>
                  <NavItem eventKey='languages' style={styles.tabItem}>{t('admin.languages_tabname')}</NavItem>
                  <NavItem eventKey='notifications' style={styles.tabItem}>{t('admin.notifications_tabname')}</NavItem>
                  <NavItem eventKey='payments' style={styles.tabItem}>{t('admin.payments_tabname')}</NavItem>
                  {jwt.whost && <NavItem eventKey='payouts' style={styles.tabItem}>{t('admin.payouts_tabname')}</NavItem>}
                  <NavItem eventKey='privacy-security' style={styles.tabItem}>{t('admin.privacy_tabname')}</NavItem>
                  <NavItem eventKey='verifications' style={styles.tabItem}>{t('admin.verifications_tabname')}</NavItem>
                </Nav>
              </Col>
              <Col style={styles.mainPanel} xs={12} sm={8} md={9} lg={10}>
                <Tab.Content animation>

                  <Tab.Pane eventKey='contact-info'>
                    <h3>{t('admin.contact_info_title')}</h3>
                    <ContactInfo
                      {...this.props}
                      updateUser={debouncedUpdateUser}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey='languages'>
                    <h3>{t('admin.languages_title')}</h3>
                    <ManageLanguages
                      addLanguage={this.addLanguage}
                      availableLanguages={availableLanguages}
                      knownLanguages={knownLanguages}
                      learningLanguages={learningLanguages}
                      removeLanguage={this.removeLanguage}
                      updateLanguage={this.updateLanguage}
                      updateLanguageLevel={this.updateLanguageLevel}
                      uiLanguage={uiLanguage}
                    />
                    <Button bsStyle='success' onClick={this.saveLanguages}>Save</Button>
                  </Tab.Pane>

                  <Tab.Pane eventKey='notifications'>
                    <h3>{t('admin.notifications_title')}</h3>
                    <ManageNotifications
                      {...this.props}
                      updateUser={this.updateUser}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey='payments'>
                    <h3>{t('admin.payments_payment_methods')}</h3>
                    <h5>{t('admin.payments_payment_methods_subtitle')}</h5>
                    <PaymentMethods {...this.props} />
                  </Tab.Pane>

                  {jwt.whost &&
                    <Tab.Pane eventKey='payouts'>
                      <h3>{t('admin.payments_payout_methods')}</h3>
                      <h5>{t('admin.payments_payout_methods_subtitle')}</h5>
                      <PayoutMethods {...this.props} />
                    </Tab.Pane>
                  }

                  <Tab.Pane eventKey='privacy-security'>
                    <h3>{t('admin.privacy_title')}</h3>
                    <ManageSecurity
                      {...this.props}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey='verifications'>
                    <h3>{t('admin.verifications_title')}</h3>
                    <ManageVerifications {...this.props} />
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
  uiLanguage: PropTypes.string,
  user: PropTypes.object,
  token: PropTypes.string,
}
