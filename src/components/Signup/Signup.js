// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Alert, Button, Col, FormGroup, FormControl, HelpBlock, OverlayTrigger, Panel, Tooltip, Row } from 'react-bootstrap'
import config from 'config'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { ManageLanguages } from 'components'
import moment from 'moment'
import * as signupActions from 'redux/modules/signup'
import FacebookLogin from 'react-facebook-login'
import FontAwesome from 'react-fontawesome'
import GoogleLogin from 'react-google-login'
import i18n from 'i18n/i18n-client'
import shortid from 'shortid'
import { openLoginModal, closeStudentSignupModal, closeHostSignupModal } from 'redux/modules/ui/modals'
import { validateEighteenYearsOld, validatePassword } from 'utils/validation'
import validator from 'validator'
import { filterLanguageArray } from 'utils/languages'

// Relative imports
import styles from './Signup.styles.js'

@connect(state => ({
  jwt: state && state.auth ? state.auth.jwt : {},
  loginStatus: state.auth,
  query: state.routing.locationBeforeTransitions.query,
  signupStatus: state.signupStatus,
}))
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
    languageLevelsNotValid: false,
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

  handleGoToLogin = () => {
    const { dispatch, type } = this.props

    if (type === 'STUDENT') {
      dispatch(closeStudentSignupModal())
    } else if (type === 'HOST') {
      dispatch(closeHostSignupModal())
    }

    dispatch(openLoginModal())
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

  handleLanguagesNotValidBtnClick = () => {
    if (this.state.knownLanguages.some(lang => !lang.level)) {
      this.setState({ languageLevelsNotValid: true })
    }
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
    const isValid = validatePassword(event.target.value, { firstName: modifiedValidation.firstName.value, lastName: modifiedValidation.lastName.value })
    if (isValid.valid) {
      modifiedValidation.password = { uiState: 'success', value: event.target.value }
    } else {
      modifiedValidation.password = { uiState: 'error', value: null, errorMessage: isValid.errors }
    }
    this.setState({ validatedFields: modifiedValidation })
    console.log(this)
  }

  handleBirthDateChange = event => {
    const modifiedValidation = this.state.validatedFields
    const flexibleDate = moment(event.target.value, 'YYYY-MM-DD').format('YYYY-MM-DD')
    const isValid = validateEighteenYearsOld(flexibleDate)
    modifiedValidation.birthDate = { uiState: isValid ? 'success' : 'error', value: isValid ? flexibleDate : null }
    this.setState({ validatedFields: modifiedValidation })
  }

  signup = (signupType, data) => {

    const { dispatch, type } = this.props
    const { birthDate, firstName, lastName, email, password } = this.state.validatedFields
    const { referral_user } = this.props.query

    // These properties are used regardless of signup type
    let signupObject = {
      type,
      feUserType: type,
      referralUserId: typeof referral_user === 'string' && validator.isInt(referral_user) ? referral_user : null,
      userKnownLanguages: filterLanguageArray(this.state.knownLanguages),
      userLearningLanguages: filterLanguageArray(this.state.learningLanguages),
    }

    // Determine authentication type
    if (signupType === 'email') {

      if (Object.values(this.state.validatedFields).some(field => field.uiState !== 'success')) {
        return
      }

      // Email signup object
      signupObject = Object.assign({}, signupObject, {
        password: password.value,
        birthDate: birthDate.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      })

    } else if (signupType === 'facebook' && data.accessToken && data.status !== 'unknown') {

      // Facebook signup object
      signupObject = Object.assign({}, signupObject, {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        birthDate: `${(data.birthday).substring(6, 10)}-${(data.birthday).substring(0, 2)}-${(data.birthday).substring(3, 5)}`, // Parse birthday from Facebook's format
        facebookId: data.id,
        facebookToken: data.accessToken,
      })

    } else if (signupType === 'google') {

      // Google signup object
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
    const googleToken = signupType === 'google' ? data.getAuthResponse().id_token : null

    // Dispatch signup action
    dispatch(signupActions.signup(signupType, signupObject, googleToken, () => type === 'HOST' ? dispatch(closeHostSignupModal()) : dispatch(closeStudentSignupModal())))

  }

  render() {

    const {
      knownLanguages,
      learningLanguages,
      languageLevelsNotValid,
    } = this.state

    // Determine available languages
    let usedLanguages = []
    let allLanguages = []
    let availableLanguages = []

    if (i18n.store.data[i18n.language]) {
      usedLanguages = learningLanguages.map(lang => lang.language).concat(knownLanguages.map(lang => lang.language)).filter(lang => lang !== null)
      allLanguages = Object.entries(i18n.store.data[i18n.language].translation.languages).map(([id, label]) => ({ id, label }))
      availableLanguages = allLanguages.filter(lang => usedLanguages.indexOf(lang.id) === -1)
    }

    const {
      t,
      signupStatus,
    } = this.props

    const {
      email,
      firstName,
      lastName,
      password,
      birthDate,
    } = this.state.validatedFields

    // To do: refactor to use array.some method; more performant than array.map in this case
    let languagesAreValid = false
    this.state.knownLanguages.map(language => { if (language.level && language.language) { languagesAreValid = true } })

    // To do: refactor to use array.some method; more performant than array.map in this case
    let emailFormIsValid = true
    Object.values(this.state.validatedFields).map(field => { if (field.uiState !== 'success') { emailFormIsValid = false } })

    return (
      <div style={styles.signupPanel}>

        {this.state.page === 1 &&
        <div>
          <Row>
            <Col xs={12}>
              <h2 style={{ color: '#32325D' }}>{t('common.language_modal_hello')}</h2>
              <h5><small>{t('common.language_modal_title')}</small></h5>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <ManageLanguages
                addLanguage={this.addLanguage}
                availableLanguages={availableLanguages}
                knownLanguages={knownLanguages}
                learningLanguages={learningLanguages}
                levelNotSelectedError={languageLevelsNotValid}
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
                  <Button style={styles.nextBtn} onClick={this.handleLanguagesNotValidBtnClick} className='disabled'>{t('common.next')}</Button>
                </OverlayTrigger>
              }
              {languagesAreValid &&
                <Button style={styles.nextBtn} bsStyle='success' onClick={() => this.changePage(2)}>{t('common.next')}</Button>
              }
            </Col>
          </Row>
        </div>
            }

        {this.state.page === 2 &&
        <div>
          <div style={styles.signupMenu}>
            <Row>
              <Col xs={12}>
                <Panel header={<h4>{t('common.sign_up_email')}</h4>} style={{ boxShadow: 'none' }}>

                  {signupStatus.error && signupStatus.errorMessage.statusCode === 409 &&
                    <Row>
                      <Col sm={12}>
                        <Alert bsStyle='danger'>
                          <p>
                            <a onClick={this.handleGoToLogin}>{t('common.signup_conflict')}</a>
                          </p>
                        </Alert>
                      </Col>
                    </Row>
                  }

                  <form onSubmit={event => {
                    event.preventDefault()
                    this.signup('email')
                  }}
                  >
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
                        {password.uiState === 'error' &&
                          <HelpBlock>{t(`common.password_validation_messages.${password.errorMessage[0]}`)}</HelpBlock>
                        }
                      </FormGroup>
                    </OverlayTrigger>
                    <FormGroup validationState={birthDate.uiState}>
                      <FormControl
                        type='date'
                        style={styles.emailSignupInput}
                        placeholder={t('common.birthday_placeholder')}
                        onChange={event => this.handleBirthDateChange(event)}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                    <Button
                      disabled={!emailFormIsValid || signupStatus.loading}
                      bsStyle='success'
                      type='submit'
                    >
                      {signupStatus.loading ? <span>{t('common.Loading')}</span> : <span>{t('common.Sign_up')}</span>}
                    </Button>
                  </form>
                </Panel>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <FacebookLogin
                  appId={config.facebookAppID}
                  callback={response => this.signup('facebook', response)}
                  cssClass='btn btn-block btn-lg btn-default btn-with-icon btn-facebook-login'
                  scope='public_profile, email, user_birthday'
                  fields='first_name,last_name,email,birthday'
                  textButton={t('common.sign_up_facebook')}
                  icon='fa-facebook-square'
                />
              </Col>
              <Col xs={12}>
                <GoogleLogin
                  onFailure={() => {}}
                  onSuccess={response => this.signup('google', response)}
                  clientId='1094866362095-7qjnb8eojdpl862qiu6odrpdgrnrqgp5.apps.googleusercontent.com'
                  className='btn btn-block btn-lg btn-default btn-with-icon btn-google-login'
                  scope='openid email profile'
                >
                  <FontAwesome name='google' /> {t('common.sign_up_google')}
                </GoogleLogin>
              </Col>
            </Row>


          </div>
        </div>
            }

        <Row>
          <Col xs={12} style={styles.logIn} className='text-muted'>
            {t('common.Already_have_account')} <a onClick={this.handleGoToLogin}>{t('common.Log_in')}</a>
          </Col>
        </Row>

      </div>
    )
  }
}

Signup.propTypes = {
  compact: PropTypes.bool,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  loginStatus: PropTypes.object,
  logout: PropTypes.func,
  signup: PropTypes.func,
  signupStatus: PropTypes.object,
  t: PropTypes.func,
  type: PropTypes.string,
  query: PropTypes.object,
}
