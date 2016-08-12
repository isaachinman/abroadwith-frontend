import React, { Component, PropTypes } from 'react'
import { Alert, Button, Col, Form, FormGroup, FormControl, Grid, InputGroup, Row } from 'react-bootstrap'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import * as authActions from 'redux/modules/auth'
import styles from './Login.styles'
import { validateExists, validatePassword } from 'utils/validation'

@connect(state => ({ user: state.auth.user, loginStatus: state.auth }), authActions)
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

  handleEmailChange = (event) => {
    let newValidationObj = this.state.validatedFields // eslint-disable-line
    newValidationObj.email.value = event.target.value
    this.setState({ validatedFields: newValidationObj })
  }

  handlePasswordChange = (event) => {
    let newValidationObj = this.state.validatedFields // eslint-disable-line
    newValidationObj.password.value = event.target.value
    this.setState({ validatedFields: newValidationObj })
  }

  handleFacebookLogin = (response) => {
    console.log(response)
  }

  handleGoogleLogin = (response) => {
    console.log(response)
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
      this.props.login(email, password)
    } else {
      return false
    }

  }

  render() {

    const { user, loginStatus, logout } = this.props
    const { email, password } = this.state.validatedFields
    const facebookAppID = process.env.FACEBOOK_APP_ID

    console.log(facebookAppID)

    return (

      <div style={styles.loginPage}>
        <Helmet title='Login'/>
        <h1 style={styles.h1}>Login</h1>

        {!user &&

        <Grid>
          <Row style={styles.paddedRow}>
            <Col sm={4} smOffset={4}>
              <FacebookLogin
                appId='144997212531478'
                autoLoad
                callback={this.handleFacebookLogin}
                cssClass='btn btn-block'
                fields='name,email,birthday'
                textButton='Login with Facebook'
              />
            </Col>
          </Row>
          <Row style={styles.paddedRow}>
            <Col sm={4} smOffset={4}>
              <GoogleLogin
                buttonText='Login with Google'
                callback={this.handleGoogleLogin}
                clientId='1094866362095-7qjnb8eojdpl862qiu6odrpdgrnrqgp5.apps.googleusercontent.com'
                cssClass='btn btn-block'
              />
            </Col>
          </Row>
          <Form horizontal onSubmit={this.handleEmailLogin}>
            <FormGroup controlId='formHorizontalEmail' validationState={email.uiState}>
              <Col sm={4} smOffset={4}>
                <InputGroup>
                  <InputGroup.Addon><FontAwesome name='at'/></InputGroup.Addon>
                  <FormControl type='email' placeholder='Email' onChange={this.handleEmailChange.bind(this)} />
                </InputGroup>
              </Col>
            </FormGroup>

            <FormGroup controlId='formHorizontalPassword' validationState={password.uiState}>
              <Col sm={4} smOffset={4}>
                <InputGroup>
                  <InputGroup.Addon><FontAwesome name='lock'/></InputGroup.Addon>
                  <FormControl type='password' placeholder='Password' onChange={this.handlePasswordChange.bind(this)} />
                </InputGroup>
              </Col>
              <Col sm={12}>
                {password.message}
              </Col>
            </FormGroup>

            <FormGroup>
              <Col sm={12}>
                <Button type='submit'>
                  Sign in
                </Button>
              </Col>
            </FormGroup>
            {loginStatus.error &&
              <Col sm={4} smOffset={4}>
                <Alert bsStyle='danger'>
                  <h5>LOGIN_FAILED</h5>
                </Alert>
              </Col>
            }
          </Form>
        </Grid>
        }
        {user && <div>
            <p>You are currently logged in as {user.name}.</p>

            <div>
              <button className='btn btn-danger' onClick={logout}><i className='fa fa-sign-out'/>{' '}Log Out</button>
            </div>
          </div>
        }
      </div>
    )
  }
}

Login.propTypes = {
  user: PropTypes.object,
  login: PropTypes.func,
  loginStatus: PropTypes.object,
  logout: PropTypes.func,
}
