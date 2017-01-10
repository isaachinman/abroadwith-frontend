// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { Grid, Row } from 'react-bootstrap'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'

@asyncConnect([{
  deferred: false,
  promise: ({ store: { dispatch, getState } }) => {

    const { auth, privateData } = getState()
    const promises = []

    console.log(privateData)

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
export default class MultiHomeLandingPage extends Component {
  render() {
    const { homes, t } = this.props
    return (
      <Grid>
        <Row>
          <Helmet title={t('manage_home.title')} />
          Multi Home Landing Page
          {Object.keys(homes).map(homeID => <div>{homeID}</div>)}
        </Row>
      </Grid>
    )
  }
}

MultiHomeLandingPage.propTypes = {
  homes: PropTypes.object,
  t: PropTypes.func,
}
