import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { isLoaded, load as loadHomestay } from 'redux/modules/publicData/loadHomestay'
import { asyncConnect } from 'redux-async-connect'
import { initializeWithKey } from 'redux-form'

@asyncConnect([{
  deferred: true,
  promise: ({ params, store: { dispatch, getState } }) => {
    if (!isLoaded(getState())) {
      return dispatch(loadHomestay(params.homeID))
    }
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
    } = this.props.homestay
    /* eslint-enable */

    return (
      <div>

        <Helmet title='Homestay' />
        <div>
          <div className='container'>

            <h1>Host: {host.firstName}</h1>
            <h2>Location: {location.city}, {location.country}</h2>

          </div>
        </div>

      </div>
    )
  }
}

Homestay.propTypes = {
  homestay: React.PropTypes.object,
  error: React.PropTypes.object,
}
