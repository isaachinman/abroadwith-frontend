// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { initializeWithKey } from 'redux-form'
import { isLoaded, load as loadUser } from 'redux/modules/publicData/users/loadUser'
import Helmet from 'react-helmet'
import React, { Component } from 'react'

@asyncConnect([{
  deferred: true,
  promise: ({ params, store: { dispatch, getState } }) => {
    if (!isLoaded(getState(), params.userID)) {
      console.log('it was not already loaded')
      return dispatch(loadUser(params.userID))
    }

    console.log('it was indeed already loaded')

  },
}])
@connect(
  (state, ownProps) => ({
    debug: ownProps,
    user: state.publicData.users[ownProps.params.userID],
    error: state.publicData.users.error,
    loading: state.publicData.users.loading,
  }),
  { initializeWithKey }
)
export default class UserProfile extends Component {
  render() {

    const { error, loading, user } = this.props

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
    } = user ? user : {}
    /* eslint-enable */

    return (
      <div>

        <Helmet title='User Profile' />

        {!error && !loading && user &&

          <div className='container'>
            <h1>User: {firstName}</h1>
            <h2>Location: {homeCity}, {homeCountry}</h2>
          </div>

        }

      </div>
    )
  }
}

UserProfile.propTypes = {
  loading: React.PropTypes.bool,
  user: React.PropTypes.object,
  error: React.PropTypes.object,
}
