// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { isLoaded, load as loadHomestay, loadRoomCalendar } from 'redux/modules/publicData/homes/loadHome'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const result = !isLoaded(getState(), params.homeID) ? dispatch(loadHomestay(params.homeID)) : null
    return __CLIENT__ ? null : result

  },
}])
@connect(
  (state, ownProps) => ({
    debug: ownProps,
    homestay: state.publicData.homestays[ownProps.params.homeID],
    error: state.publicData.homestays.error,
    loading: state.publicData.homestays.loading,
  })
)
export default class Homestay extends Component {

  state = {
    activeRoom: this.props.homestay.data.rooms[0],
  }

  componentDidMount = () => {
    this.fetchRoomCalendar()
  }

  fetchRoomCalendar = () => {
    const { activeRoom } = this.state
    const { dispatch, homestay } = this.props
    dispatch(loadRoomCalendar(homestay.data.id, activeRoom.id))
  }

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
    } = homestay && homestay.data ? homestay.data : {}
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
  dispatch: PropTypes.func,
  error: PropTypes.object,
  homestay: PropTypes.object,
  loading: PropTypes.bool,
}
