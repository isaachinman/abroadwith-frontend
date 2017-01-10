// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { Grid, Row } from 'react-bootstrap'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { load as loadHomestayWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    return dispatch(loadHomestayWithAuth(getState().auth.token, params.homeID))

  },
}])
@connect(
  (state, ownProps) => ({
    home: state.privateData.homes[ownProps.params.homeID],
  }),
)
@translate()
export default class ManageHome extends Component {
  render() {
    const { t } = this.props
    console.log(this)
    return (
      <Grid>
        <Row>
          <Helmet title={t('manage_home.title')} />
          Single home management page
        </Row>
      </Grid>
    )
  }
}

ManageHome.propTypes = {
  homes: PropTypes.object,
  t: PropTypes.func,
}
