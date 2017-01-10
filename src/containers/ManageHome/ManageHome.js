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

@connect(
  (state, ownProps) => ({
    home: state.privateData.homes[ownProps.params.homeID],
    token: state.auth.token,
  }),
)
@translate()
export default class ManageHome extends Component {

  componentDidMount = () => {
    console.log(this)
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

  render() {
    const { home, t } = this.props
    console.log(this)

    const activeStep = home && home.data ? this.determineHomeActivationState() : ''

    return (
      <Grid>
        <Helmet title={t('manage_home.title')} />
        <Tab.Container id='left-tabs-example' defaultActiveKey={activeStep}>
          <Row style={styles.mainRow}>
            <Col style={styles.sidebar} xs={12} sm={4} md={3} lg={2}>
              <Nav bsStyle='pills' stacked>
                <NavItem eventKey='location' style={styles.tabItem}>{t('manage_home.location_tabname')}</NavItem>
                <NavItem eventKey='basics' style={styles.tabItem}>{t('manage_home.basics_tabname')}</NavItem>
                <NavItem eventKey='description' style={styles.tabItem}>{t('manage_home.description_tabname')}</NavItem>
                <NavItem eventKey='immersions' style={styles.tabItem}>{t('manage_home.immersions_tabname')}</NavItem>
                <NavItem eventKey='rooms' style={styles.tabItem}>{t('manage_home.rooms_tabname')}</NavItem>
                <NavItem eventKey='photos' style={styles.tabItem}>{t('manage_home.photos_tabname')}</NavItem>
                <NavItem eventKey='pricing' style={styles.tabItem}>{t('manage_home.pricing_tabname')}</NavItem>
                <NavItem eventKey='success' style={styles.tabItem}>{t('manage_home.success_title')}</NavItem>
              </Nav>
            </Col>
            <Col style={styles.mainPanel} xs={12} sm={8} md={9} lg={10}>
              <Tab.Content animation>

                <Tab.Pane eventKey='location'>
                  <h3>{t('manage_home.location_title')}</h3>
                </Tab.Pane>

                <Tab.Pane eventKey='basics'>
                  <h3>{t('manage_home.basics_title')}</h3>
                </Tab.Pane>

                <Tab.Pane eventKey='description'>
                  <h3>{t('manage_home.description_title')}</h3>
                </Tab.Pane>

                <Tab.Pane eventKey='immersions'>
                  <h3>{t('manage_home.immersions_title')}</h3>
                </Tab.Pane>

                <Tab.Pane eventKey='rooms'>
                  <h3>{t('manage_home.rooms_title')}</h3>
                </Tab.Pane>

                <Tab.Pane eventKey='photos'>
                  <h3>{t('manage_home.photos_title')}</h3>
                </Tab.Pane>

                <Tab.Pane eventKey='pricing'>
                  <h3>{t('manage_home.pricing_title')}</h3>
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
