// Absolute imports
import { Alert, Button, Col, Form, FormGroup, FormControl, InputGroup, Row } from 'react-bootstrap'
import config from 'config'
import { connect } from 'react-redux'
import { closeLoginModal, openStudentSignupModal, openResetPasswordModal } from 'redux/modules/ui/modals'
import { validateExists, validatePassword } from 'utils/validation'
import * as authActions from 'redux/modules/auth'
import FacebookLogin from 'react-facebook-login'
import FontAwesome from 'react-fontawesome'
import GoogleLogin from 'react-google-login'
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'

// Relative imports
import styles from './Login.styles'

@connect(state => ({
  jwt: state.auth.jwt,
  loginStatus: state.auth,
  loginModal: state.ui.modals.loginModal,
}))
@translate()
export default class Login extends Component {

  state = {
    validatedFields: {
      email: {
        uiState: null,
      },
      password: {
        uiState: null,
      },
    },
  }

  closeModal = () => {

    const { dispatch, jwt, loginModal } = this.props

    if (jwt && jwt.rid && typeof loginModal.loggedInCallback === 'function') {
      loginModal.loggedInCallback()
    }

    dispatch(closeLoginModal())

  }

  handleGoToResetPassword = () => {
    const { dispatch } = this.props
    dispatch(closeLoginModal())
    dispatch(openResetPasswordModal())
  }

  handleGoToSignup = () => {
    const { dispatch } = this.props
    dispatch(closeLoginModal())
    dispatch(openStudentSignupModal())
  }

  handleEmailChange = (newValue) => {
    let newValidationObj = this.state.validatedFields // eslint-disable-line
    newValidationObj.email.value = newValue
    this.setState({ validatedFields: newValidationObj })
  }

  handlePasswordChange = (newValue) => {
    let newValidationObj = this.state.validatedFields // eslint-disable-line
    newValidationObj.password.value = newValue
    this.setState({ validatedFields: newValidationObj })
  }

  handleFacebookLogin = (response) => {
    console.log(response)
    if (response.accessToken && response.status !== 'unknown') {
      const { dispatch } = this.props
      dispatch(authActions.facebookLogin(response.email, response.accessToken, this.closeModal))
    }
  }

  handleGoogleLogin = (response) => {
    const { dispatch } = this.props
    dispatch(authActions.googleLogin(response.getBasicProfile().getEmail(), response.getAuthResponse().id_token, this.closeModal))
  }

  handleGoogleLoginFailure = () => {
    console.log('Google Login Failed')
  }

  handleEmailLogin = (event) => {

    event.preventDefault()

    const { email, password } = this.state.validatedFields
    let formIsValid = true

    let modifiedValidation = this.state.validatedFields // eslint-disable-line

    Object.keys(modifiedValidation).map(field => {
      if (validateExists(modifiedValidation[field].value) === false) {
        modifiedValidation[field].uiState = 'error'
        formIsValid = false
      } else {
        modifiedValidation[field].uiState = null
      }
    })

    const passwordValidation = validatePassword(password.value)

    if (passwordValidation.valid === false) {
      modifiedValidation.password.message = passwordValidation.errors
      modifiedValidation.password.uiState = 'error'
      formIsValid = false
    } else {
      modifiedValidation.password.message = []
      modifiedValidation.password.uiState = null
    }

    this.setState({ validatedFields: modifiedValidation })

    if (formIsValid) {
      const { dispatch } = this.props
      dispatch(authActions.login(email.value, password.value, null, null, this.closeModal))
    } else {
      return false
    }

  }

  render() {

    const {
      compact,
      t,
      loginStatus,
    } = this.props

    const {
      email,
      password,
    } = this.state.validatedFields

    return (
      <div style={styles.loginPanel}>
        <Row>
          <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
            <FacebookLogin
              appId={config.facebookAppID}
              callback={this.handleFacebookLogin}
              cssClass='btn btn-block btn-lg btn-default btn-with-icon btn-facebook-login'
              fields='name,email,birthday'
              textButton={t('common.login_with_facebook')}
              icon='fa-facebook-square'
            />
          </Col>
          <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
            <GoogleLogin
              onFailure={this.handleGoogleLoginFailure}
              onSuccess={this.handleGoogleLogin}
              clientId='1094866362095-7qjnb8eojdpl862qiu6odrpdgrnrqgp5.apps.googleusercontent.com'
              className='btn btn-block btn-lg btn-default btn-with-icon btn-google-login'
            >
              <FontAwesome name='google' /> {t('common.login_with_google')}
            </GoogleLogin>
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2} style={styles.dividerContainer}>
            <div style={styles.divider}>
              <span style={styles.dividerText}>
                {t('common.words.or')}
              </span>
            </div>
          </Col>
        </Row>

        {loginStatus.error &&
          <Row>
            <Col sm={compact ? 12 : 4} smOffset={compact ? 0 : 4}>
              <Alert bsStyle='danger'>
                <h5>{t('common.login_failed')}</h5>
              </Alert>
            </Col>
          </Row>
        }

        <Form horizontal onSubmit={this.handleEmailLogin}>

          <FormGroup controlId='formHorizontalEmail' validationState={email.uiState}>
            <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
              <InputGroup>
                <InputGroup.Addon><FontAwesome name='at' /></InputGroup.Addon>
                <FormControl required type='email' placeholder={t('common.Email')} onChange={event => this.handleEmailChange(event.target.value)} />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup controlId='formHorizontalPassword' validationState={password.uiState}>
            <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
              <InputGroup>
                <InputGroup.Addon><FontAwesome name='lock' /></InputGroup.Addon>
                <FormControl required type='password' placeholder={t('common.Password')} onChange={event => this.handlePasswordChange(event.target.value)} />
              </InputGroup>
              <a style={{ fontSize: 12 }} className='pull-right' onClick={this.handleGoToResetPassword}>{t('common.forgot_password')}</a>
            </Col>
            {password.message && password.message.length > 0 &&
              <Col xs={12}>
                <Alert bsStyle='danger'>
                  {t(`common.password_validation_messages.${password.message}`)}
                </Alert>
              </Col>
            }
          </FormGroup>

          <FormGroup>
            <Col sm={12}>
              <Button type='submit' bsStyle='primary' disabled={loginStatus.loggingIn} >
                {loginStatus.loggingIn ? <span>{t('common.Loading')}</span> : <span>{t('common.Log_in')}</span>}
              </Button>
            </Col>
          </FormGroup>

        </Form>

        <Row>
          <Col xs={12} style={styles.signUp} className='text-muted'>
            {t('common.Dont_have_account')} <a onClick={this.handleGoToSignup}>{t('common.Sign_up')}</a>
          </Col>
        </Row>
      </div>
    )
  }
}

Login.propTypes = {
  compact: PropTypes.bool,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
  login: PropTypes.func,
  facebookLogin: PropTypes.func,
  googleLogin: PropTypes.func,
  loginStatus: PropTypes.object,
  loginModal: PropTypes.object,
  logout: PropTypes.func,
}
