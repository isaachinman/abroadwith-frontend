// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { Col, Grid, Row } from 'react-bootstrap'
import { isLoaded, load as loadUser } from 'redux/modules/publicData/users/loadUser'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

// Relative imports
import styles from './UserProfile.styles'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const result = !isLoaded(getState(), params.userID) ? dispatch(loadUser(params.userID)) : null
    return __CLIENT__ ? null : result

  },
}])
@connect(
  (state, ownProps) => ({
    user: state.publicData.users[ownProps.params.userID],
    error: state.publicData.users.error,
    loading: state.publicData.users.loading,
  })
)
@translate()
export default class UserProfile extends Component {
  render() {

    const { error, loading, t, user } = this.props
    console.log(this)

    return (
      <div>

        {!error && !loading && user &&

          <span>
            <Helmet title={`${user.firstName}'s ${t('users.title')}`} />

            <Grid style={styles.grid}>
              <div style={styles.bg} />

              <div style={styles.contentContainer}>
                <Row>
                  <Col xs={12} style={styles.borderBottom}>
                    <h1>{user.firstName} <small>USERTYPE</small></h1>
                  </Col>
                </Row>
              </div>

            </Grid>
          </span>

        }

      </div>
    )
  }
}

UserProfile.propTypes = {
  error: PropTypes.object,
  loading: PropTypes.bool,
  user: PropTypes.object,
  t: PropTypes.func,
}
