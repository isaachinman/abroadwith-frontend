// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createHomestay } from 'redux/modules/privateData/homes/homeManagement'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { Alert, Button, Col, Grid, Panel, Row } from 'react-bootstrap'
import { verifyEmail } from 'redux/modules/privateData/users/verifications'
import FontAwesome from 'react-fontawesome'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import styles from './EmailVerification.styles'


@connect(state => ({
  jwt: state.auth.jwt,
  user: state.privateData.user.data ? state.privateData.user.data : {},
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
      setTimeout(() => dispatch(verifyEmail(token, location.query.secret, location.query.key)), 2000)

    }

  }

  componentWillReceiveProps = nextProps => {

    const { user, verifications } = this.props
    if (!verifications.email.loaded && nextProps.verifications.email.loaded && !nextProps.verifications.email.error) {
      if (!user) {
        this.setState({ whatToRender: 'EmailVerificationSuccessGeneral' })
      } else {
        this.setState({ whatToRender: `EmailVerificationSuccess${user.feUserType === 'HOST' ? 'Host' : 'Student'}` })
      }
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
    const { user, t, token, verifications } = this.props
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
              {whatToRender === 'EmailVerificationFailure' &&
                <Alert bsStyle='danger'>
                  {t('common.email_verification_failed')} <FontAwesome name='times' />
                </Alert>
              }
              {(whatToRender === 'EmailAlreadyVerified' || whatToRender === 'EmailVerificationSuccessGeneral') &&
                <Alert bsStyle='success'>
                  <h5>{t('common.email_verification_succeeded')}</h5>
                  <p>
                    {t('common.email_verified_success_paragraph1')}
                  </p>
                  <div style={styles.btnBottom}>
                    <Link to={`/user/${this.props.jwt.rid}`}>
                      <Button bsStyle='primary'>{t('common.navbar_profile')}</Button>
                    </Link>
                  </div>
                </Alert>
              }
              {whatToRender === 'EmailVerificationSuccessStudent' &&
                <Alert bsStyle='success'>
                  <h5>{t('common.email_verification_succeeded')}</h5>
                  <p>
                    {t('common.email_verified_success_student')}
                  </p>
                  <div style={styles.btnBottom}>
                    <Link to={`/user/${this.props.jwt.rid}`}>
                      <Button bsStyle='primary'>{t('common.navbar_profile')}</Button>
                    </Link>
                  </div>
                </Alert>
              }
              {whatToRender === 'EmailVerificationSuccessHost' &&
                <Alert bsStyle='success'>
                  <h5>{t('common.email_verification_succeeded')}</h5>
                  <p>
                    {t('common.email_verified_success_host')}
                  </p>
                  <div style={styles.btnBottom}>
                    <Button onClick={() => this.props.dispatch(createHomestay(token, user, true))} bsStyle='primary'>{t('common.navbar_become_host')}</Button>
                  </div>
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
  jwt: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  verifications: PropTypes.object,
}
