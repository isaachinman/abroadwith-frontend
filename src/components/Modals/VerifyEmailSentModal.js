// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { closeVerifyEmailSentModal } from 'redux/modules/ui/modals'

@connect(state => ({
  user: state.privateData.user,
  verifyEmailSentModal: state.ui.modals.verifyEmailSentModal,
}))
@translate()
export default class VerifyEmailSentModal extends Component {

  render() {

    console.log(this)
    const { dispatch, t, verifyEmailSentModal, user } = this.props

    return (
      <Modal show={verifyEmailSentModal.open} bsSize='small'>
        <Modal.Header>
          <Modal.Title>{t('common.verification_email_sent_modal_title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user.data.feUserType === 'HOST' ?
            <Row>
              <Col xs={12}>
                <p>{t('common.verification_email_sent_modal_host')}</p>
              </Col>
            </Row>
            :
            <Row>
              <Col xs={12}>
                <p>{t('common.verification_email_sent_modal_student')}</p>
              </Col>
            </Row>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => dispatch(closeVerifyEmailSentModal())} block>{t('common.hide_alert')}</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

VerifyEmailSentModal.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  verifyEmailSentModal: PropTypes.object,
  verifications: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
