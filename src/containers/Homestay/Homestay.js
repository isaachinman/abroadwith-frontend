// Absolute imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { load as loadHomestay } from 'redux/modules/publicData/homes/loadHomestay'
import { asyncConnect } from 'redux-async-connect'
import { initializeWithKey } from 'redux-form'

@asyncConnect([{
  deferred: true,
  promise: ({ params, store: { dispatch } }) => {
    return dispatch(loadHomestay(params.homeID))
  },
}])
@connect(
  state => ({
    homestay: state.publicData.homestay.data,
    error: state.publicData.homestay.error,
    loading: state.publicData.homestay.loading,
  }),
  { initializeWithKey }
)
export default class Homestay extends Component {
  render() {

    const { error, homestay, loading } = this.props

    /* eslint-disable */
    const {
      basics,
      description,
      host,
      id,
      immersions,
      isActive,
      location,
      photos,
      pricing,
      rooms,
      stayAvailableLanguages,
      tandemAvailableLanguages,
      teacherAvailableLanguages,
    } = homestay ? homestay : {}
    /* eslint-enable */

    return (
      <div>

        <Helmet title='Homestay' />

        {!error && !loading && homestay &&

          <div className='container'>
            <h1>Host: {host.firstName}</h1>
            <h2>Location: {location.city}, {location.country}</h2>
          </div>

        }

      </div>
    )
  }
}

Homestay.propTypes = {
  error: React.PropTypes.object,
  homestay: React.PropTypes.object,
  loading: React.PropTypes.bool,
}
