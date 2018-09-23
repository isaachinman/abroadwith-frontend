// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, FormControl, FormGroup, Modal, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { closeResetPasswordModal } from 'redux/modules/ui/modals'
import { requestResetPassword } from 'redux/modules/resetPassword'

@connect(state => ({
  resetPassword: state.resetPassword,
  resetPasswordModal: state.ui.modals.resetPasswordModal,
}))
@translate()
export default class ResetPasswordModal extends Component {

  render() {

    const { dispatch, t, resetPassword, resetPasswordModal } = this.props

    return (
      <Modal show={resetPasswordModal.open} onHide={() => dispatch(closeResetPasswordModal())} bsSize='small'>
        <Modal.Header>
          <Modal.Title>{t('common.reset_password_title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!resetPassword.requestEmail.loaded &&
            <span>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      type='email'
                      placeholder={t('common.Email')}
                      onChange={event => this.setState({ email: event.target.value })}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
              </Row>
            </span>
          }
          {resetPassword.requestEmail.loaded &&
            <Row>
              <Col xs={12}>
                {t('reset_password.request_processed')}
              </Col>
            </Row>
          }
        </Modal.Body>
        <Modal.Footer>
          {resetPassword.requestEmail.loaded ?
            <Button onClick={() => dispatch(closeResetPasswordModal())} block>{t('common.hide_alert')}</Button>
            :
            <Button disabled={resetPassword.requestEmail.loading} onClick={() => dispatch(requestResetPassword(this.state.email))} block bsStyle='primary'>{resetPassword.requestEmail.loading ? t('common.Loading') : t('reset_password.reset_button')}</Button>
          }
        </Modal.Footer>
      </Modal>
    )
  }
}

ResetPasswordModal.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func,
  resetPassword: PropTypes.object,
  resetPasswordModal: PropTypes.object,
}
