// Absolute imports
import { asyncConnect } from 'redux-async-connect'
import { connect } from 'react-redux'
import { initializeWithKey } from 'redux-form'
import { isLoaded, load as loadUser } from 'redux/modules/publicData/loadUser'
import Helmet from 'react-helmet'
import React, { Component } from 'react'

@asyncConnect([{
  deferred: true,
  promise: ({ params, store: { dispatch, getState } }) => {
    if (!isLoaded(getState())) {
      return dispatch(loadUser(params.userID))
    }
  },
}])
@connect(
  state => ({ // eslint-disable-line
    user: state.publicData.user.data,
    error: state.publicData.user.error,
    loading: state.publicData.user.loading,
  }),
  { initializeWithKey }
)
export default class UserProfile extends Component {
  render() {

    /* eslint-disable */
    const {
      aboutMe,
      age,
      amazingFeat,
      canShare,
      education,
      emailVerified,
      favouriteBooks,
      favouriteFilms,
      firstName,
      gender,
      grewUp,
      hasLived,
      hasVisited,
      home,
      homeCity,
      homeCountry,
      idVerified,
      interests,
      joinedMonth,
      joinedYear,
      languagesKnown,
      languagesLearning,
      occupation,
      phoneVerified,
      photo,
    } = this.props.user
    /* eslint-enable */

    console.log(this)

    return (
      <div>

        <Helmet title='User Profile' />
        <div className='container'>

          <h1>User: {firstName}</h1>
          <h2>Location: {homeCity}, {homeCountry}</h2>

        </div>


      </div>
    )
  }
}

UserProfile.propTypes = {
  user: React.PropTypes.object,
  error: React.PropTypes.object,
}
