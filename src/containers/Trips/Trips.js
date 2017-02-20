// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import Helmet from 'react-helmet'
import { load as loadHomestay } from 'redux/modules/publicData/homes/loadHome'
import { loadHomestayBookings } from 'redux/modules/privateData/bookings/homestayBookings'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

// Relative imports
// import styles from './Trips.styles'

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {

    return dispatch(loadHomestayBookings(getState().auth.token)).then(data => dispatch(loadHomestay(data[0].homeId)))

  },
}])
@connect(
  state => ({
    token: state.auth.token,
  }),
)
@translate()
export default class Trips extends Component {

  render() {

    const { t } = this.props

    return (

      <div>
        <Helmet title={t('trips.title')} />
      </div>
    )
  }
}

Trips.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func,
  token: PropTypes.string,
}
