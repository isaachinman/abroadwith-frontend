// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, FormControl, FormGroup, Row, Modal } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import ReactTelInput from 'react-telephone-input'
import validator from 'validator'
import { update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
import { requestVerificationSMS, verifyPhone } from 'redux/modules/privateData/users/verifications'

// Relative imports
import styles from './ManagePhoneNumbers.styles.js'

@connect(state => ({
  user: state.privateData.user.data,
  jwt: state.auth.jwt,
  verifications: state.verifications,
}))
@translate()
export default class ManagePhoneNumbers extends Component {

  state = {
    modalIsOpen: false,
    page: 1,
    validatedFields: {
      verificationCode: {
        uiState: null,
      },
    },
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  validatePhone = telNumber => {

    // Currently we don't have a great way to validate phones
    if (validator.isLength(telNumber, { min: 7 })) {
      this.setState({ phoneIsValid: true, phoneNumber: telNumber })
    } else if (this.state.phoneIsValid) {
      this.setState({ phoneIsValid: false })
    }

  }

  handleNewPhone = () => {

    const { jwt, user, dispatch, token } = this.props

    if (this.state.phoneNumber !== user.phoneNumber) {

      const newUserObject = user
      newUserObject.phoneNumber = this.state.phoneNumber

      dispatch(updateUser(jwt.rid, newUserObject, token, () => {
        dispatch(requestVerificationSMS(token, () => {
          this.setState({ page: 2 })
        }))
      }))

    } else {
      dispatch(requestVerificationSMS(token, () => {
        this.setState({ page: 2 })
      }))
    }

  }

  handleVerificationChange = event => {

    const verificationCode = event.target.value
    const newValidatedFields = this.state.validatedFields

    // Validate for Twilio's SMS code format
    if (validator.isLength(verificationCode, { min: 3, max: 5 }) && validator.isInt(verificationCode)) {
      newValidatedFields.verificationCode = {
        uiState: 'success',
        value: verificationCode,
      }
    } else {
      newValidatedFields.verificationCode = {
        uiState: 'error',
      }
    }

    this.setState({ validatedFields: newValidatedFields })

  }

  verifyPhone = () => {

    const { dispatch, token, user, verifications, successCallback } = this.props

    const verifyPhoneObject = {
      secret: verifications.phone.phoneSecret,
      key: user.phoneNumber,
      shortCode: this.state.validatedFields.verificationCode.value,
    }

    if (typeof successCallback === 'function') {
      dispatch(verifyPhone(token, verifyPhoneObject, successCallback))
    } else {
      dispatch(verifyPhone(token, verifyPhoneObject))
    }


  }

  render() {

    const {
      closeModal,
      dismissable,
      user,
      show,
      modalOnly,
      t,
      verifications,
    } = this.props

    const {
      page,
      phoneIsValid,
    } = this.state

    const {
      verificationCode,
    } = this.state.validatedFields

    return (
      <div>

        {user.phoneNumber && user.verifications.phone &&
          <div style={styles.marginTop10}>
            {user.phoneNumber}
          </div>
        }

        {!user.verifications.phone &&
          <div onClick={this.openModal} style={styles.marginTop10}>
            {!modalOnly && <a>{t('common.add_a_phone')}</a>}
            <Modal
              onHide={dismissable ? closeModal || this.closeModal : () => {}}
              show={show || this.state.modalIsOpen}
              bsSize='small'
            >
              <div style={styles.modal}>
                {page === 1 &&
                <div>
                  <Row>
                    <Col xs={12}>
                      <h4>{t('common.whats_your_phone')}</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ReactTelInput
                        initialValue={user.phoneNumber}
                        onChange={this.validatePhone}
                        flagsImagePath='https://abroadwith.imgix.net/app/flags/flags.png'
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Button onClick={this.handleNewPhone} bsStyle='success' block style={styles.btn} disabled={!phoneIsValid || verifications.phone.loading}>
                        {verifications.phone.loading ? <span>{t('common.Loading')}</span> : <span>{t('common.request_verification_sms')}</span>}
                      </Button>
                    </Col>
                  </Row>
                </div>
                  }
                {page === 2 &&
                <div>
                  <Row>
                    <Col xs={12}>
                      <p>
                        {t('common.we_sent_verification_sms')}
                      </p>
                      <p>
                        {t('common.please_enter_sms_code_and_click')}
                      </p>
                      <FormGroup validationState={verificationCode.uiState}>
                        <FormControl
                          type='text'
                          style={styles.emailSignupInput}
                          placeholder={t('common.verification_code')}
                          onChange={event => this.handleVerificationChange(event)}
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                      <Button onClick={this.verifyPhone} block bsStyle='success' style={styles.btn} disabled={verificationCode.uiState !== 'success'}>
                        {t('common.verify')}
                      </Button>
                    </Col>
                  </Row>
                </div>
                  }
              </div>
            </Modal>
          </div>
        }
      </div>
    )
  }
}

ManagePhoneNumbers.propTypes = {
  closeModal: PropTypes.func,
  dismissable: PropTypes.bool,
  jwt: PropTypes.object,
  token: PropTypes.string,
  dispatch: PropTypes.func,
  modalOnly: PropTypes.bool,
  updateUser: PropTypes.func,
  user: PropTypes.object,
  verifications: PropTypes.object,
  show: PropTypes.bool,
  successCallback: PropTypes.func,
  t: PropTypes.func,
}
