// Absolute imports
import { asyncConnect } from 'redux-async-connect'
import { connect } from 'react-redux'
import { initializeWithKey } from 'redux-form'
import { load as loadUser } from 'redux/modules/publicData/loadUser'
import Helmet from 'react-helmet'
import React, { Component } from 'react'

@asyncConnect([{
  deferred: true,
  promise: ({ params, store: { dispatch } }) => {
    return dispatch(loadUser(params.userID))
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
