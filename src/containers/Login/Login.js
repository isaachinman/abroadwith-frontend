import React, { Component, PropTypes } from 'react'
import { Form, FormGroup, Button, ControlLabel, FormControl, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import * as authActions from 'redux/modules/auth'
import styles from './Login.styles'
import { validateExists, validatePassword } from 'utils/validation'

@connect(state => ({ user: state.auth.user }), authActions)
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
    this.setState({
      validatedFields: {... email: {... {value: event.target.value}} },
    })
  }

  handlePasswordChange = (event) => {
    this.setState({
      validatedFields: {... password: {... {value: event.target.value}} },
    })
  }

  handleSubmit = (event) => {

    event.preventDefault()

    const { email, password } = this.state.validatedFields
    let formIsValid = true


    let modifiedValidation = this.state.validatedFields // eslint-disable-line

    Object.keys(modifiedValidation).map(field => {
      if (validateExists(field.value) === false) {
        modifiedValidation[field].uiState = 'error'
        formIsValid = false
      }
    })

    const passwordValidation = validatePassword(this.state.password)

    if (passwordValidation.valid === false) {
      modifiedValidation.password.message = passwordValidation.errors
      formIsValid = false
    }

    this.setState({ validatedFields: modifiedValidation })

    if (formIsValid) {
      this.props.login(email, password)
    } else {
      return false
    }

  }

  render() {
    console.log(this.state)
    const { user, logout } = this.props
    const { email, password } = this.state.validatedFields
    return (

      <div style={styles.loginPage}>
        <Helmet title='Login'/>
        <h1>Login</h1>

        {!user &&
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormGroup controlId='formHorizontalEmail' validationState={email.uiState}>
            <Col componentClass={ControlLabel} sm={2} smOffset={2}>
              Email
            </Col>
            <Col sm={4}>
              <FormControl type='email' placeholder='Email' onChange={this.handleEmailChange.bind(this)} />
            </Col>
          </FormGroup>

          <FormGroup controlId='formHorizontalPassword' validationState={password.uiState}>
            <Col componentClass={ControlLabel} sm={2} smOffset={2}>
              Password
            </Col>
            <Col sm={4}>
              <FormControl type='password' placeholder='Password' onChange={this.handlePasswordChange.bind(this)} />
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
        </Form>
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
  logout: PropTypes.func,
}
