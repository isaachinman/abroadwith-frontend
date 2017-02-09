// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import Radium from 'radium'
import { translate } from 'react-i18next'

// Relative imports
import styles from './UserProfileEdit.styles'

@connect(
  (state, ownProps) => ({
    auth: state.auth,
    error: state.publicData.users.error,
    loading: state.publicData.users.loading,
    user: state.publicData.users[ownProps.params.userID],
  })
)
@translate()
@Radium
export default class UserProfileEdit extends Component {

  render() {

    const { t } = this.props

    return (
      <div>

        <span>
          <Helmet title={t('users.edit_title')} />

          <Grid style={styles.grid}>
            <div style={styles.bg} />

            <div style={styles.contentContainer}>

              <Row>
                <Col xs={12}>
                    The question is whether to build a page which looks visually similar to the actual profile page, or build something that looks totally different, more admin/UI.
                  </Col>
              </Row>

              <Row>
                <Col xs={12}>
                    Tradeoff is that any style updates to the profile page would have to be reflected here.
                  </Col>
              </Row>

            </div>

          </Grid>
        </span>


      </div>
    )
  }
}

UserProfileEdit.propTypes = {
  t: PropTypes.func,
}
