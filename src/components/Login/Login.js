// Absolute imports
import { Alert, Button, Col, Form, FormGroup, FormControl, InputGroup, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { validateExists, validatePassword } from 'utils/validation'
import * as authActions from 'redux/modules/auth'
import FacebookLogin from 'react-facebook-login'
import FontAwesome from 'react-fontawesome'
import GoogleLogin from 'react-google-login'
import React, { Component, PropTypes } from 'react'

// Relative imports
import styles from './Login.styles'

@connect(state => ({ jwt: state.auth.jwt, loginStatus: state.auth }), authActions)
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
  }

  handleFacebookLoginFailure = () => {
    console.log('Facebook Login Failed')
  }

  handleGoogleLogin = (response) => {
    console.log(response)
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
      this.props.loginAndGetFullInto(email.value, password.value)
    } else {
      return false
    }

  }

  render() {

    const { compact, jwt, loginStatus, logout } = this.props
    const { email, password } = this.state.validatedFields

    return (
      <div style={styles.loginPanel}>

        {!jwt &&

          <span>

            <Row style={styles.paddedRow}>
              <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
                <FacebookLogin
                  appId='144997212531478'
                  autoLoad
                  callback={this.handleFacebookLogin}
                  cssClass='btn btn-block btn-lg btn-default btn-with-icon btn-facebook-login'
                  fields='name,email,birthday'
                  textButton='Login with Facebook'
                  icon='fa-facebook-square'
                />
              </Col>
            </Row>

            <Row style={styles.paddedRow}>
              <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
                <GoogleLogin
                  onFailure={this.handleGoogleLoginFailure}
                  onSuccess={this.handleGoogleLogin}
                  clientId='1094866362095-7qjnb8eojdpl862qiu6odrpdgrnrqgp5.apps.googleusercontent.com'
                  className='btn btn-block btn-lg btn-default btn-with-icon btn-google-login'
                >
                  <FontAwesome name='google' /> Login with Google
                </GoogleLogin>
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2} style={styles.dividerContainer}>
                <div style={styles.divider}>
                  <span style={styles.dividerText}>
                    or
                  </span>
                </div>
              </Col>
            </Row>

            {loginStatus.error &&
              <Row>
                <Col sm={compact ? 12 : 4} smOffset={compact ? 0 : 4}>
                  <Alert bsStyle='danger'>
                    <h5>LOGIN_FAILED</h5>
                  </Alert>
                </Col>
              </Row>
            }

            <Form horizontal onSubmit={this.handleEmailLogin}>

              <FormGroup controlId='formHorizontalEmail' validationState={email.uiState}>
                <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
                  <InputGroup>
                    <InputGroup.Addon><FontAwesome name='at' /></InputGroup.Addon>
                    <FormControl required type='email' placeholder='Email' onChange={event => this.handleEmailChange(event.target.value)} />
                  </InputGroup>
                </Col>
              </FormGroup>

              <FormGroup controlId='formHorizontalPassword' validationState={password.uiState}>
                <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
                  <InputGroup>
                    <InputGroup.Addon><FontAwesome name='lock' /></InputGroup.Addon>
                    <FormControl required type='password' placeholder='Password' onChange={event => this.handlePasswordChange(event.target.value)} />
                  </InputGroup>
                </Col>
                <Col sm={12}>
                  {password.message}
                </Col>
              </FormGroup>

              <FormGroup>
                <Col sm={12}>
                  <Button type='submit' disabled={loginStatus.loading} >
                    Sign in
                  </Button>
                </Col>
              </FormGroup>

            </Form>

          </span>

        }

        {jwt &&
          <div>
            <p>You are currently logged in as {jwt.name}.</p>

            <div>
              <button className='btn btn-danger' onClick={logout}><i className='fa fa-sign-out' />{' '}Log Out</button>
            </div>
          </div>
        }

      </div>
    )
  }
}

Login.propTypes = {
  compact: PropTypes.bool,
  jwt: PropTypes.object,
  loginAndGetFullInto: PropTypes.func,
  loginStatus: PropTypes.object,
  logout: PropTypes.func,
}
