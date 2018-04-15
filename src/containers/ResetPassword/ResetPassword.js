// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, FormControl, FormGroup, Grid, Tooltip, Panel, OverlayTrigger, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { resetPasswordSet } from 'redux/modules/resetPassword'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'
import { validatePassword } from 'utils/validation'
import validator from 'validator'

@connect(state => ({
  jwt: state.auth.jwt,
  resetPassword: state.resetPassword.resetPassword,
}))
@translate()
export default class ResetPassword extends Component {

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

  componentWillMount = () => {

    const { dispatch, router } = this.props

    // Without a secret in the url params, this page will never work
    if (!router.location.query.id) {
      dispatch(push('/'))
    }

  }

  resetPassword = () => {
    const { email, password } = this.state.validatedFields
    const { dispatch, jwt, router } = this.props
    dispatch(resetPasswordSet(router.location.query.id, email.value, password.value, jwt === null ? '/login' : '/'))
  }

  handleEmailChange = event => {
    const modifiedValidation = this.state.validatedFields
    const isValid = validator.isEmail(event.target.value)
    modifiedValidation.email = { uiState: isValid ? 'success' : 'error', value: isValid ? event.target.value : null }
    this.setState({ validatedFields: modifiedValidation })
  }

  handlePasswordChange = event => {
    const modifiedValidation = this.state.validatedFields
    const isValid = validatePassword(event.target.value).valid
    modifiedValidation.password = { uiState: isValid ? 'success' : 'error', value: isValid ? event.target.value : null }
    this.setState({ validatedFields: modifiedValidation })
  }

  render() {

    const { email, password } = this.state.validatedFields
    const { resetPassword, t } = this.props

    const formIsValid = !Object.values(this.state.validatedFields).some(field => field.uiState !== 'success')

    console.log(this)

    return (
      <div>
        <Helmet title={t('reset_password.title')} />
        <Grid>
          <Row style={{ marginTop: 100 }}>
            <Col xs={12} md={6} mdOffset={3}>
              <Panel>
                <Row>
                  <Col xs={12}>
                    <h1>{t('reset_password.title')}</h1>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup validationState={email.uiState}>
                      <FormControl
                        type='email'
                        placeholder={t('common.Email')}
                        onChange={event => this.handleEmailChange(event)}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('common.password_validation_message')}</Tooltip>}>
                      <FormGroup validationState={password.uiState}>
                        <FormControl
                          type='password'
                          placeholder={t('common.Password')}
                          onChange={event => this.handlePasswordChange(event)}
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </OverlayTrigger>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Button onClick={this.resetPassword} disabled={!formIsValid || resetPassword.loading} bsStyle='primary'>{resetPassword.loading ? t('common.Loading') : t('reset_password.reset_button')}</Button>
                  </Col>
                </Row>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

ResetPassword.propTypes = {
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  resetPassword: PropTypes.object,
  router: PropTypes.object,
  t: PropTypes.func,
}
