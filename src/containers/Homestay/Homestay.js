// Absolute imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { isLoaded, load as loadHomestay } from 'redux/modules/publicData/homes/loadHomestay'
import { asyncConnect } from 'redux-async-connect'
// import { initializeWithKey } from 'redux-form'

const mapDispatchToProps = (state, globalState) => {
  console.log('STATE: ', state)
  console.log('GLOBAL STATE: ', globalState)
  console.log('trying to set home: ', state.publicData.homestay[globalState.params.homeID])
  return { homestay: state.publicData.homestay[globalState.params.homeID] }
}

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
  mapDispatchToProps
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
