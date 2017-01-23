// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Alert, Col, Grid, Panel, Row } from 'react-bootstrap'
import { verifyEmail } from 'redux/modules/privateData/users/verifications'
import FontAwesome from 'react-fontawesome'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import EmailAlreadyVerified from './subcomponents/EmailAlreadyVerified'
import styles from './EmailVerification.styles'


@connect(state => ({
  jwt: state.auth.jwt,
  user: state.privateData.user.data,
  token: state.auth.token,
  verifications: state.verifications,
}))
@translate()
export default class EmailVerification extends Component {

  state = {
    whatToRender: null,
  }

  componentDidMount = () => {

    const { dispatch, location, token, user } = this.props

    // Determine if user already has verified email
    if (user && user.verifications.email) {

      this.setState({ whatToRender: 'EmailAlreadyVerified' })

    } else {

      // If they haven't, POST the verification data
      dispatch(verifyEmail(token, location.query.secret, location.query.key))

    }

  }

  componentDidUpdate = () => {
    const { whatToRender } = this.state
    const { verifications } = this.props
    if (verifications.email.error && whatToRender !== 'EmailVerificationFailure') {
      this.setState({ whatToRender: 'EmailVerificationFailure' })
    }
  }

  render() {
    const { whatToRender } = this.state
    const { t, verifications } = this.props
    console.log(this)
    return (
      <div>
        <Helmet title={t('common.email_verification_title')} />
        <Grid>
          <Row style={styles.h1Row}>
            <Col xs={12}>
              <h1>{t('common.email_verification_title')}</h1>
            </Col>
          </Row>
          <SpinLoader show={whatToRender === null || verifications.email.loading}>
            <Panel style={styles.panel}>
              {whatToRender === 'EmailAlreadyVerified' &&
                <EmailAlreadyVerified {...this.props} />
              }
              {whatToRender === 'EmailVerificationFailure' &&
                <Alert bsStyle='danger'>
                  {t('common.email_verification_failed')} <FontAwesome name='times' />
                </Alert>
              }
            </Panel>
          </SpinLoader>
        </Grid>
      </div>
    )
  }
}

EmailVerification.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
  user: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  verifications: PropTypes.object,
}
