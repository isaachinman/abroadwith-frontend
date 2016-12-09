// Absolute imports
import React, { Component, PropTypes } from 'react'
import shortid from 'shortid'
import { Accordion, Button, Col, Collapse, FormGroup, FormControl, OverlayTrigger, Panel, Tooltip, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { ManageLanguages } from 'components'
import * as signupActions from 'redux/modules/signup'
import FacebookLogin from 'react-facebook-login'
import FontAwesome from 'react-fontawesome'
import GoogleLogin from 'react-google-login'
import i18n from 'i18n/i18n-client'
import { validateEighteenYearsOld, validatePassword } from 'utils/validation'
import validator from 'validator'

// Relative imports
import styles from './Signup.styles.js'

const filterLanguageArray = array => {

  const newArray = array.filter(language => {
    return language.language && language.level
  }).map(language => {
    delete language.id // eslint-disable-line
    return language
  })
  return newArray

}

@connect(state => ({ jwt: state.auth.jwt, loginStatus: state.auth }), signupActions)
@translate()
export default class Signup extends Component {

  state = {
    page: 1,
    validatedFields: {
      birthDate: {
        uiState: null,
      },
      firstName: {
        uiState: null,
      },
      lastName: {
        uiState: null,
      },
      email: {
        uiState: null,
      },
      password: {
        uiState: null,
      },
    },
    learningLanguages: [
      {
        id: shortid.generate(),
        language: null,
        level: null,
      },
    ],
    knownLanguages: [
      {
        id: shortid.generate(),
        language: null,
        level: null,
      },
    ],
  }

  addLanguage = type => {
    this.setState({
      [`${type}Languages`]: this.state[`${type}Languages`].concat({
        id: shortid.generate(),
        language: null,
        level: null,
      }),
    })
  }

  removeLanguage = (type, id) => {
    this.setState({
      [`${type}Languages`]: this.state[`${type}Languages`].filter(lang => {
        return lang.id !== id
      }),
    })
  }

  updateLanguage = (type, id, data) => {

    const newArray = this.state[`${type}Languages`].map(language => {
      if (language.id !== id) {
        return language
      }
      return ({
        id,
        language: data.length > 0 ? data[0].id : null,
        level: data.length > 0 ? language.level : null,
      })
    })
    this.setState({ [`${type}Languages`]: newArray })

  }

  updateLanguageLevel = (type, id, eventKey) => {
    const newArray = this.state[`${type}Languages`].map(language => {
      if (language.id !== id) {
        return language
      }
      return ({
        id,
        language: language.language,
        level: eventKey,
      })
    })
    this.setState({ [`${type}Languages`]: newArray })
  }

  changePage = page => {
    this.setState({ page })
  }

  handleNameChange = (event, nameType) => {
    const modifiedValidation = this.state.validatedFields
    const isValid = validator.isLength(event.target.value, { min: 2 })
    modifiedValidation[`${nameType}Name`] = { uiState: isValid ? 'success' : 'error', value: isValid ? event.target.value : null }
    this.setState({ validatedFields: modifiedValidation })
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

  handlebirthDateChange = event => {
    const modifiedValidation = this.state.validatedFields
    const isValid = validateEighteenYearsOld(event.target.value)
    modifiedValidation.birthDate = { uiState: isValid ? 'success' : 'error', value: isValid ? event.target.value : null }
    this.setState({ validatedFields: modifiedValidation })
  }

  signup = (type, data) => {

    const { birthDate, firstName, lastName, email, password } = this.state.validatedFields

    // These properties are used regardless of signup type
    let signupObject = {
      userKnownLanguages: filterLanguageArray(this.state.knownLanguages),
      userLearningLanguages: filterLanguageArray(this.state.learningLanguages),
    }

    // Determine authentication type
    if (type === 'email') {

      signupObject = Object.assign({}, signupObject, {
        password: password.value,
        birthDate: birthDate.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      })

    } else if (type === 'facebook') {

      signupObject = Object.assign({}, signupObject, {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        birthDate: (data.birthday).substring(6, 10) + '-' + (data.birthday).substring(0, 2) + '-' + (data.birthday).substring(3, 5),
        facebookId: data.id,
        facebookToken: data.accessToken,
      })

    } else if (type === 'google') {

      console.log(data.getAuthResponse().id_token)

      signupObject = Object.assign({}, signupObject, {
        firstName: data.profileObj.givenName,
        lastName: data.profileObj.familyName,
        email: data.profileObj.email,
        birthDate: null, // Google doesn't send birthday info
        googleId: data.googleId,
      })

    }

    // Unfortunately this token has to be passed separately
    // in the case of Google signups, as we need it for subsequent login
    const googleToken = type === 'google' ? data.getAuthResponse().id_token : null

    // Dispatch signup action
    this.props.signup(type, signupObject, googleToken)

  }

  render() {

    console.log(this)

    const {
      knownLanguages,
      learningLanguages,
    } = this.state

    // Determine available languages
    const usedLanguages = learningLanguages.map(lang => lang.language).concat(knownLanguages.map(lang => lang.language)).filter(lang => lang !== null)
    const allLanguages = Object.entries(i18n.store.data[i18n.language].translation.languages).map(([id, label]) => ({ id, label }))
    const availableLanguages = allLanguages.filter(lang => usedLanguages.indexOf(lang.id) === -1)

    const {
      jwt,
      logout,
      t,
    } = this.props

    const {
      email,
      firstName,
      lastName,
      password,
      birthDate,
    } = this.state.validatedFields

    let languagesAreValid = false
    this.state.knownLanguages.map(language => { if (language.level && language.language) { languagesAreValid = true } })

    let emailFormIsValid = true
    Object.values(this.state.validatedFields).map(field => { if (field.uiState !== 'success') { emailFormIsValid = false } })

    return (
      <div style={styles.signupPanel}>

        {!jwt &&

          <span>

            <Collapse in={this.state.page === 1}>
              <div>
                <Row style={styles.paddedRow}>
                  <Col xs={12}>
                    <h2>{t('common.language_modal_hello')}</h2>
                    <h5>{t('common.language_modal_title')}</h5>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={10} smOffset={1}>
                    <ManageLanguages
                      addLanguage={this.addLanguage}
                      availableLanguages={availableLanguages}
                      knownLanguages={knownLanguages}
                      learningLanguages={learningLanguages}
                      removeLanguage={this.removeLanguage}
                      updateLanguage={this.updateLanguage}
                      updateLanguageLevel={this.updateLanguageLevel}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    {!languagesAreValid &&
                      <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('common.languages_choose_at_least_one')}</Tooltip>}>
                        <Button>{t('common.next')}</Button>
                      </OverlayTrigger>
                    }
                    {languagesAreValid &&
                      <Button bsStyle='success' onClick={() => this.changePage(2)}>{t('common.next')}</Button>
                    }
                  </Col>
                </Row>
              </div>
            </Collapse>

            <Collapse in={this.state.page === 2}>
              <div style={styles.signupMenu}>
                <Row>
                  <Col xs={12}>
                    <Accordion style={styles.emailSignupBtn}>
                      <Panel header={t('common.sign_up_email')} eventKey='1'>
                        <form>
                          <FormGroup validationState={firstName.uiState}>
                            <FormControl
                              type='text'
                              style={styles.emailSignupInput}
                              placeholder={t('common.First_name')}
                              onChange={event => this.handleNameChange(event, 'first')}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                          <FormGroup validationState={lastName.uiState}>
                            <FormControl
                              type='text'
                              style={styles.emailSignupInput}
                              placeholder={t('common.Last_name')}
                              onChange={event => this.handleNameChange(event, 'last')}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                          <FormGroup validationState={email.uiState}>
                            <FormControl
                              type='email'
                              style={styles.emailSignupInput}
                              placeholder={t('common.Email')}
                              onChange={event => this.handleEmailChange(event)}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                          <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('common.password_validation_message')}</Tooltip>}>
                            <FormGroup validationState={password.uiState}>
                              <FormControl
                                type='password'
                                style={styles.emailSignupInput}
                                placeholder={t('common.Password')}
                                onChange={event => this.handlePasswordChange(event)}
                              />
                              <FormControl.Feedback />
                            </FormGroup>
                          </OverlayTrigger>
                          <FormGroup validationState={birthDate.uiState}>
                            <FormControl
                              type='date'
                              style={styles.emailSignupInput}
                              placeholder={t('common.birthDate')}
                              onChange={event => this.handlebirthDateChange(event)}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                          <Button
                            disabled={!emailFormIsValid}
                            bsStyle='success'
                            onClick={() => this.signup('email')}
                          >
                            {t('common.Sign_up')}
                          </Button>
                        </form>
                      </Panel>
                    </Accordion>
                  </Col>
                </Row>

                <Row style={styles.paddedRow}>
                  <Col xs={12}>
                    <FacebookLogin
                      appId='144997212531478'
                      callback={response => this.signup('facebook', response)}
                      cssClass='btn btn-block btn-lg btn-default btn-with-icon btn-facebook-login'
                      fields='first_name,last_name,email,birthday'
                      textButton={t('common.sign_up_facebook')}
                      icon='fa-facebook-square'
                    />
                  </Col>
                </Row>

                <Row style={styles.paddedRow}>
                  <Col xs={12}>
                    <GoogleLogin
                      onFailure={() => {}}
                      onSuccess={response => this.signup('google', response)}
                      clientId='1094866362095-7qjnb8eojdpl862qiu6odrpdgrnrqgp5.apps.googleusercontent.com'
                      className='btn btn-block btn-lg btn-default btn-with-icon btn-google-login'
                    >
                      <FontAwesome name='google' /> {t('common.sign_up_google')}
                    </GoogleLogin>
                  </Col>
                </Row>


              </div>
            </Collapse>

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

Signup.propTypes = {
  compact: PropTypes.bool,
  jwt: PropTypes.object,
  loginStatus: PropTypes.object,
  logout: PropTypes.func,
  signup: PropTypes.func,
  t: PropTypes.func,
}
