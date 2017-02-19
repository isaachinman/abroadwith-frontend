// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import config from 'config'
import { createHomestay } from 'redux/modules/privateData/homes/homeManagement'
import FontAwesome from 'react-fontawesome'
import { translate } from 'react-i18next'
import { Grid, Row, Panel, Col } from 'react-bootstrap'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'

// Relative imports
import styles from './ManageHomeLandingPage.styles'

@asyncConnect([{
  deferred: true,
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
    user: state.privateData.user.data,
    token: state.auth.token,
  }),
)
@translate()
export default class ManageHomeLandingPage extends Component {

  redirectToManageHome = homeID => {
    this.props.dispatch(push(`/manage-home/${homeID}`))
  }

  render() {

    const { dispatch, homes, user, t, token } = this.props

    return (
      <Grid>
        <Helmet title={t('manage_home.multi_home_title')} />
        <Row style={styles.h1Row}>
          <Col xs={12}>
            <h1>{t('manage_home.multi_home_title')}</h1>
          </Col>
        </Row>
        <Row>
          {Object.keys(homes).map(homeID => {
            return (
              <Col xs={12} md={6} lg={4} key={homeID}>
                <Panel onClick={() => this.redirectToManageHome(homeID)} style={styles.homePanel}>
                  {typeof homes[homeID] === 'object' && homes[homeID].data && homes[homeID].data.location && homes[homeID].data.isActive &&
                    <span>
                      <div style={Object.assign({}, styles.homePhoto, { backgroundImage: `url(${config.img}${homes[homeID].data.images[0].imagePath})` })} />
                      <div>{homes[homeID].data.location.street}, {homes[homeID].data.location.zipCode}</div>
                      <div>{homes[homeID].data.location.city}</div>
                    </span>
                  }
                  {typeof homes[homeID] === 'object' && homes[homeID].data && (!homes[homeID].data.location || !homes[homeID].data.isActive) &&
                    <span>Unfinished home</span>
                  }
                </Panel>
              </Col>
            )
          })}
          <Col xs={12} md={6} lg={4}>
            <Panel onClick={() => dispatch(createHomestay(token, user, true))} style={styles.homePanel}>
              <h5>Create new home <small><FontAwesome name='plus' /></small></h5>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

ManageHomeLandingPage.propTypes = {
  dispatch: PropTypes.func,
  homes: PropTypes.object,
  user: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
