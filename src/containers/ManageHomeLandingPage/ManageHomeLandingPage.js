// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { Grid, Row, Panel, Col } from 'react-bootstrap'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'

@asyncConnect([{
  deferred: false,
  promise: ({ store: { dispatch, getState } }) => {

    const { auth, privateData } = getState()
    const promises = []

    if (privateData.user.data) {
      privateData.user.data.homeIds.map(homeID => {
        promises.push(dispatch(loadHomestayWithAuth(auth.token, homeID)))
      })
    }

    return Promise.all(promises)

  },
}])
@connect(
  state => ({
    homes: state.privateData.homes,
  }),
)
@translate()
export default class ManageHomeLandingPage extends Component {

  redirectToManageHome = homeID => {
    this.props.dispatch(push(`/manage-home/${homeID}`))
  }

  render() {
    const { homes, t } = this.props
    return (
      <Grid>
        <Helmet title={t('manage_home.multi_home_title')} />
        <Row>
          <h1>{t('manage_home.multi_home_title')}</h1>
        </Row>
        <Row>
          {Object.keys(homes).map(homeID => {
            return (
              <Col xs={12} md={6} lg={3} key={homeID}>
                <Panel onClick={() => this.redirectToManageHome(homeID)}>
                  Home: {homeID}
                </Panel>
              </Col>
            )
          })}
        </Row>
      </Grid>
    )
  }
}

ManageHomeLandingPage.propTypes = {
  dispatch: PropTypes.func,
  homes: PropTypes.object,
  t: PropTypes.func,
}
