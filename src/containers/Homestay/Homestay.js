// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { initializeWithKey } from 'redux-form'
import { isLoaded, load as loadHomestay } from 'redux/modules/publicData/homes/loadHomestay'
import Helmet from 'react-helmet'
import React, { Component } from 'react'

@asyncConnect([{
  deferred: true,
  promise: ({ params, store: { dispatch, getState } }) => {
    if (!isLoaded(getState(), params.homeID)) {
      console.log('it was not already loaded')
      return dispatch(loadHomestay(params.homeID))
    }

    console.log('it was indeed already loaded')

  },
}])
@connect(
  (state, ownProps) => ({
    debug: ownProps,
    homestay: state.publicData.homestays[ownProps.params.homeID],
    error: state.publicData.homestays.error,
    loading: state.publicData.homestays.loading,
  }),
  { initializeWithKey }
)
export default class Homestay extends Component {
  render() {

    console.log(this)

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
