// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { isLoaded, load as loadUser } from 'redux/modules/publicData/users/loadUser'
import Helmet from 'react-helmet'
import React, { Component } from 'react'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const result = !isLoaded(getState(), params.userID) ? dispatch(loadUser(params.userID)) : null
    return __CLIENT__ ? null : result

  },
}])
@connect(
  (state, ownProps) => ({
    debug: ownProps,
    user: state.publicData.users[ownProps.params.userID],
    error: state.publicData.users.error,
    loading: state.publicData.users.loading,
  })
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
