// Absolute imports
import React, { Component, PropTypes } from 'react'
import Radium from 'radium'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { Button, Col, Grid, Image, Modal, Nav, NavItem, Row, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { load as loadHomestayWithAuth, updateHomestay } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { openVerifyPhoneModal } from 'redux/modules/ui/modals'
import HomeStatusCodes from 'data/constants/HomeStatusCodes'
import config from 'config'

// Relative imports
import styles from './ManageHome.styles'
import HomeBasics from './subcomponents/HomeBasics'
import HomeDescription from './subcomponents/HomeDescription'
import HomeImmersions from './subcomponents/HomeImmersions'
import HomeLocation from './subcomponents/HomeLocation'
import HomePhotos from './subcomponents/HomePhotos'
import HomePricing from './subcomponents/HomePricing'
import HomeRooms from './subcomponents/HomeRooms'
import HomeCalendar from './subcomponents/HomeCalendar'

const homeSteps = ['location', 'basics', 'description', 'immersions', 'rooms', 'photos', 'pricing']

@connect(
  (state, ownProps) => ({
    home: state.privateData.homes ? state.privateData.homes[ownProps.params.homeID] : {},
    token: state.auth.token,
    modals: state.ui.modals,
  }),
)
@translate()
@Radium
export default class ManageHome extends Component {

  state = {
    tab: null,
    holdBackStep: false,
    successModalOpen: false,
  }

  componentDidMount = () => {
    const { dispatch, home, routeParams, token } = this.props
    if (!home || !home.data) {
      dispatch(loadHomestayWithAuth(token, parseInt(routeParams.homeID)))
    }
  }

  componentWillReceiveProps = (nextProps) => {

    const { dispatch, home, routeParams } = this.props

    if (home && home.data) {

      // Home was just published case
      if (!home.data.homeActivationResponse.activated && nextProps.home.data.homeActivationResponse.activated) {
        this.setState({ successModalOpen: true })
      }

      // If user is in home-creation process, override previous tab navigation on save,
      // and progress them to the next step
      if (!home.data.homeActivationResponse.activated && this.state.tab) {
        this.setState({ tab: null })
      }

      // User is in home-creation process and now needs to verify their phone
      if (!home.data.homeActivationResponse.activated &&
          home.data.homeActivationResponse.code !== 'PHONE_NOT_VERIFIED' &&
          nextProps.data && nextProps.data.homeActivationResponse.code === 'PHONE_NOT_VERIFIED') {
        dispatch(openVerifyPhoneModal('HOME_PUBLICATION', { homeID: routeParams.homeID }))
      }

    }
  }

  componentDidUpdate = () => {
    console.log('componentDidUpdate')
    const { dispatch, home, modals, routeParams } = this.props
    if (home && home.data && home.data.homeActivationResponse.code === 'PHONE_NOT_VERIFIED' && !modals.verifyPhoneModal.open) {
      dispatch(openVerifyPhoneModal('HOME_PUBLICATION', { homeID: routeParams.homeID }))
    }
  }

  tabOverride = tab => {
    this.setState({ tabOverride: tab })
  }

  updateHome = (homeObject, notificationMessage) => {
    const { dispatch, token, routeParams } = this.props
    dispatch(updateHomestay(token, routeParams.homeID, homeObject, notificationMessage))
  }

  determineHomeCreationStep = () => {

    const { homeActivationResponse } = this.props.home.data
    const { tabOverride } = this.state

    // This function shouldn't be called if a home is already activated,
    // but this catch is here just in case
    if (homeActivationResponse.activated) {
      return {
        stepName: 'calendar',
        stepNum: 8,
      }
    }

    const step = Object.keys(HomeStatusCodes).find(status => HomeStatusCodes[status].indexOf(homeActivationResponse.code) > -1)

    return {
      stepName: tabOverride || step,
      stepNum: tabOverride ? homeSteps.indexOf(step) : homeSteps.indexOf(step) + 1,
    }

  }

  closeSuccessModal = () => this.setState({ successModalOpen: false })

  handleTabChange = tab => this.setState({ tab })

  render() {

    const { home, routeParams, t } = this.props
    const { successModalOpen, tab } = this.state

    const inProgress = home && home.data && !home.data.homeActivationResponse.activated
    const activeStep = inProgress ? this.determineHomeCreationStep() : { stepName: 'calendar', stepNum: 8 }

    return (
      <Grid>
        <Helmet title={t('manage_home.title')} />
        {home && home.data && home.data.homeActivationResponse.code !== 'PHONE_NOT_VERIFIED' &&
          <span>
            <Tab.Container id='manage-home' onSelect={this.handleTabChange} activeKey={tab || activeStep.stepName}>
              <Row style={styles.mainRow}>

                <Col style={styles.sidebar} xs={12} sm={3} md={2}>
                  <Nav bsStyle='pills' stacked>
                    <NavItem
                      disabled={inProgress && activeStep.stepNum < 1}
                      eventKey='location'
                      style={styles.tabItem}
                    >
                      {t('manage_home.location_tabname')}
                    </NavItem>
                    <NavItem
                      disabled={inProgress && activeStep.stepNum < 2}
                      eventKey='basics'
                      style={styles.tabItem}
                    >
                      {t('manage_home.basics_tabname')}
                    </NavItem>
                    <NavItem
                      disabled={inProgress && activeStep.stepNum < 3}
                      eventKey='description'
                      style={styles.tabItem}
                    >
                      {t('manage_home.description_tabname')}
                    </NavItem>
                    <NavItem
                      disabled={inProgress && activeStep.stepNum < 4}
                      eventKey='immersions'
                      style={styles.tabItem}
                    >
                      {t('manage_home.immersions_tabname')}
                    </NavItem>
                    <NavItem
                      disabled={inProgress && activeStep.stepNum < 5}
                      eventKey='rooms'
                      style={styles.tabItem}
                    >
                      {t('manage_home.rooms_tabname')}
                    </NavItem>
                    <NavItem
                      disabled={inProgress && activeStep.stepNum < 6}
                      eventKey='photos'
                      style={styles.tabItem}
                    >
                      {t('manage_home.photos_tabname')}
                    </NavItem>
                    <NavItem
                      disabled={inProgress && activeStep.stepNum < 7}
                      eventKey='pricing'
                      style={styles.tabItem}
                    >
                      {t('manage_home.pricing_tabname')}
                    </NavItem>
                    <NavItem
                      disabled={inProgress}
                      eventKey='calendar'
                      style={styles.tabItem}
                    >
                      {t('common.navbar_calendar')}
                    </NavItem>
                  </Nav>
                </Col>

                <Col style={styles.mainCol} xs={12} sm={9} md={10}>
                  <div style={styles.mainPanel}>
                    <Tab.Content animation>

                      <Tab.Pane eventKey='location'>
                        <h2>{t('manage_home.location_title')}</h2>
                        <HomeLocation
                          {...this.props}
                          activeStep={activeStep}
                          inProgress={inProgress}
                          updateHome={this.updateHome}
                          activeTab={tab || activeStep.stepName}
                        />
                      </Tab.Pane>

                      <Tab.Pane unmountOnExit eventKey='basics'>
                        <h2>{t('manage_home.basics_title')}</h2>
                        <HomeBasics
                          {...this.props}
                          activeStep={activeStep}
                          inProgress={inProgress}
                          updateHome={this.updateHome}
                        />
                      </Tab.Pane>

                      <Tab.Pane unmountOnExit eventKey='description'>
                        <h2>{t('manage_home.description_title')}</h2>
                        <HomeDescription
                          {...this.props}
                          inProgress={inProgress}
                          updateHome={this.updateHome}
                        />
                      </Tab.Pane>

                      <Tab.Pane unmountOnExit eventKey='immersions'>
                        <h2>{t('manage_home.immersions_title')}</h2>
                        <HomeImmersions
                          {...this.props}
                          inProgress={inProgress}
                          updateHome={this.updateHome}
                        />
                      </Tab.Pane>

                      <Tab.Pane unmountOnExit eventKey='rooms'>
                        <h2>{t('manage_home.rooms_title')}</h2>
                        <HomeRooms
                          {...this.props}
                          tabOverride={this.tabOverride}
                          inProgress={inProgress}
                          updateHome={this.updateHome}
                        />
                      </Tab.Pane>

                      <Tab.Pane unmountOnExit eventKey='photos'>
                        <h2>{t('manage_home.photos_title')}</h2>
                        <HomePhotos
                          {...this.props}
                          tabOverride={this.tabOverride}
                          inProgress={inProgress}
                          updateHome={this.updateHome}
                        />
                      </Tab.Pane>

                      <Tab.Pane unmountOnExit eventKey='pricing'>
                        <h2>{t('manage_home.pricing_title')}</h2>
                        <HomePricing
                          {...this.props}
                          inProgress={inProgress}
                          updateHome={this.updateHome}
                        />
                      </Tab.Pane>

                      <Tab.Pane unmountOnExit eventKey='calendar'>
                        <h2>{t('home_calendar.title')}</h2>
                        {!inProgress && <HomeCalendar homeID={parseInt(routeParams.homeID)} />}
                      </Tab.Pane>

                    </Tab.Content>
                  </div>
                </Col>

              </Row>
            </Tab.Container>
            <Modal
              bsSize='small'
              show={successModalOpen}
              onHide={this.closeSuccessModal}
            >
              <Modal.Header closeButton>
                <Modal.Title>{t('manage_home.success_subtitle')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col xs={12}>
                    <Image src={home.data.images.length > 0 ? `${config.img}${home.data.images[0].imagePath}` : ''} responsive rounded />
                    <div style={styles.successModalBody}>
                      <p>{t('manage_home.now_accepting_guests')}</p>
                      <Link to={`/home/${routeParams.homeID}`}>
                        <Button bsStyle='primary' block>{t('manage_home.view_your_home')}</Button>
                      </Link>
                      <div style={styles.successModalOr}>{t('common.words.or')}</div>
                      <Button onClick={this.closeSuccessModal} block>{t('home_calendar.manage_your_calendar')}</Button>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          </span>
        }
      </Grid>
    )
  }
}

ManageHome.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  routeParams: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  modals: PropTypes.object,
}
