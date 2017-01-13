// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { Col, Grid, Nav, NavItem, Row, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { updateHomestay } from 'redux/modules/privateData/homes/homeManagement'
import HomeStatusCodes from 'data/constants/HomeStatusCodes'

// Relative imports
import styles from './ManageHome.styles'
import HomeBasics from './subcomponents/HomeBasics'
import HomeDescription from './subcomponents/HomeDescription'
import HomeImmersions from './subcomponents/HomeImmersions'
import HomeLocation from './subcomponents/HomeLocation'
import HomePhotos from './subcomponents/HomePhotos'
import HomePricing from './subcomponents/HomePricing'
import HomeRooms from './subcomponents/HomeRooms'

const homeSteps = ['location', 'basics', 'description', 'immersions', 'rooms', 'photos', 'pricing']

@connect(
  (state, ownProps) => ({
    home: state.privateData.homes[ownProps.params.homeID],
    token: state.auth.token,
  }),
)
@translate()
export default class ManageHome extends Component {

  state = {
    tab: null,
  }

  componentDidMount = () => {
    const { dispatch, home, routeParams, token } = this.props
    if (!home || !home.data) {
      dispatch(loadHomestayWithAuth(token, parseInt(routeParams.homeID)))
    }
  }

  updateHome = homeObject => {
    const { dispatch, token, routeParams } = this.props
    dispatch(updateHomestay(token, routeParams.homeID, homeObject))
  }

  determineHomeCreationStep = () => {

    const { homeActivationResponse } = this.props.home.data

    if (homeActivationResponse.activated) {
      return 'success'
    }

    const step = Object.keys(HomeStatusCodes).find(status => HomeStatusCodes[status].indexOf(homeActivationResponse.code) > -1)

    return {
      stepName: step,
      stepNum: homeSteps.indexOf(step) + 1,
    }

  }

  handleTabChange = tab => this.setState({ tab })

  render() {

    const { home, t } = this.props
    const { tab } = this.state

    const inProgress = home && home.data && !home.data.homeActivationResponse.activated
    const activeStep = inProgress ? this.determineHomeCreationStep() : {}

    return (
      <Grid>
        <Helmet title={t('manage_home.title')} />
        {home && home.data &&
          <Tab.Container id='manage-home' onSelect={this.handleTabChange} activeKey={tab || activeStep.stepName}>
            <Row style={styles.mainRow}>

              <Col style={styles.sidebar} xs={12} sm={4} md={3} lg={2}>
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
                    eventKey='success'
                    style={styles.tabItem}
                  >
                    {t('manage_home.success_title')}
                  </NavItem>
                </Nav>
              </Col>

              <Col style={styles.mainPanel} xs={12} sm={8} md={9} lg={10}>
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

                  <Tab.Pane eventKey='basics'>
                    <h2>{t('manage_home.basics_title')}</h2>
                    <HomeBasics
                      {...this.props}
                      activeStep={activeStep}
                      inProgress={inProgress}
                      updateHome={this.updateHome}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey='description'>
                    <h2>{t('manage_home.description_title')}</h2>
                    <HomeDescription
                      {...this.props}
                      inProgress={inProgress}
                      updateHome={this.updateHome}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey='immersions'>
                    <h2>{t('manage_home.immersions_title')}</h2>
                    <HomeImmersions
                      {...this.props}
                      inProgress={inProgress}
                      updateHome={this.updateHome}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey='rooms'>
                    <h2>{t('manage_home.rooms_title')}</h2>
                    <HomeRooms
                      {...this.props}
                      inProgress={inProgress}
                      updateHome={this.updateHome}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey='photos'>
                    <h2>{t('manage_home.photos_title')}</h2>
                    <HomePhotos {...this.props} />
                  </Tab.Pane>

                  <Tab.Pane eventKey='pricing'>
                    <h2>{t('manage_home.pricing_title')}</h2>
                    <HomePricing {...this.props} />
                  </Tab.Pane>

                  <Tab.Pane eventKey='success'>
                    <h2>{t('manage_home.success_subtitle')}</h2>
                  </Tab.Pane>

                </Tab.Content>
              </Col>

            </Row>
          </Tab.Container>
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
}
