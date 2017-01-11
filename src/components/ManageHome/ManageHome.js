// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { Col, Grid, Nav, NavItem, Row, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'
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

@connect(
  (state, ownProps) => ({
    home: state.privateData.homes[ownProps.params.homeID],
    token: state.auth.token,
  }),
)
@translate()
export default class ManageHome extends Component {

  state = {
    selectedTab: null,
  }

  componentDidMount = () => {
    const { dispatch, home, routeParams, token } = this.props
    if (!home || !home.data) {
      dispatch(loadHomestayWithAuth(token, parseInt(routeParams.homeID)))
    }
  }

  determineHomeActivationState = () => {

    const { homeActivationResponse } = this.props.home.data

    if (homeActivationResponse.activated) {
      return 'success'
    }

    return Object.keys(HomeStatusCodes).find(status => HomeStatusCodes[status].indexOf(homeActivationResponse.code) > -1)

  }

  handleTabChange = tab => this.setState({ tab })

  render() {

    const { home, t } = this.props
    const { tab } = this.state
    console.log(this)

    let activeStep = null
    if (tab) {
      activeStep = tab
    } else if (home && home.data) {
      activeStep = this.determineHomeActivationState()
    }

    console.log('activeStep: ', activeStep)
    const inProgress = home && home.data && !home.data.homeActivationResponse.activated

    return (
      <Grid>
        <Helmet title={t('manage_home.title')} />
        <Tab.Container id='manage-home' onSelect={this.handleTabChange} activeKey={activeStep}>
          <Row style={styles.mainRow}>

            <Col style={styles.sidebar} xs={12} sm={4} md={3} lg={2}>
              <Nav bsStyle='pills' stacked>
                <NavItem
                  disabled={inProgress && activeStep !== 'location'}
                  eventKey='location'
                  style={styles.tabItem}
                >
                  {inProgress && <span>1. </span>}
                  {t('manage_home.location_tabname')}
                </NavItem>
                <NavItem
                  disabled={inProgress && activeStep !== 'basics'}
                  eventKey='basics'
                  style={styles.tabItem}
                >
                  {inProgress && <span>2. </span>}
                  {t('manage_home.basics_tabname')}
                </NavItem>
                <NavItem
                  disabled={inProgress && activeStep !== 'description'}
                  eventKey='description'
                  style={styles.tabItem}
                >
                  {inProgress && <span>3. </span>}
                  {t('manage_home.description_tabname')}
                </NavItem>
                <NavItem
                  disabled={inProgress && activeStep !== 'immersions'}
                  eventKey='immersions'
                  style={styles.tabItem}
                >
                  {inProgress && <span>4. </span>}
                  {t('manage_home.immersions_tabname')}
                </NavItem>
                <NavItem
                  disabled={inProgress && activeStep !== 'rooms'}
                  eventKey='rooms'
                  style={styles.tabItem}
                >
                  {inProgress && <span>5. </span>}
                  {t('manage_home.rooms_tabname')}
                </NavItem>
                <NavItem
                  disabled={inProgress && activeStep !== 'photos'}
                  eventKey='photos'
                  style={styles.tabItem}
                >
                  {inProgress && <span>6. </span>}
                  {t('manage_home.photos_tabname')}
                </NavItem>
                <NavItem
                  disabled={inProgress && activeStep !== 'pricing'}
                  eventKey='pricing'
                  style={styles.tabItem}
                >
                  {inProgress && <span>7. </span>}
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
                  <h3>{t('manage_home.location_title')}</h3>
                  <HomeLocation {...this.props} />
                </Tab.Pane>

                <Tab.Pane eventKey='basics'>
                  <h3>{t('manage_home.basics_title')}</h3>
                  <HomeBasics {...this.props} />
                </Tab.Pane>

                <Tab.Pane eventKey='description'>
                  <h3>{t('manage_home.description_title')}</h3>
                  <HomeDescription {...this.props} />
                </Tab.Pane>

                <Tab.Pane eventKey='immersions'>
                  <h3>{t('manage_home.immersions_title')}</h3>
                  <HomeImmersions {...this.props} />
                </Tab.Pane>

                <Tab.Pane eventKey='rooms'>
                  <h3>{t('manage_home.rooms_title')}</h3>
                  <HomeRooms {...this.props} />
                </Tab.Pane>

                <Tab.Pane eventKey='photos'>
                  <h3>{t('manage_home.photos_title')}</h3>
                  <HomePhotos {...this.props} />
                </Tab.Pane>

                <Tab.Pane eventKey='pricing'>
                  <h3>{t('manage_home.pricing_title')}</h3>
                  <HomePricing {...this.props} />
                </Tab.Pane>

                <Tab.Pane eventKey='success'>
                  <h3>{t('manage_home.success_subtitle')}</h3>
                </Tab.Pane>

              </Tab.Content>
            </Col>

          </Row>
        </Tab.Container>
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
