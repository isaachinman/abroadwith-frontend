// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { requestVerificationEmail } from 'redux/modules/privateData/users/verifications'
import { closeVerifyEmailModal } from 'redux/modules/ui/modals'

// Relative imports
import styles from './Modals.styles'

@connect(state => ({
  user: state.privateData.user,
  verifyEmailModal: state.ui.modals.verifyEmailModal,
  verifications: state.verifications,
  token: state.auth.token,
}))
@translate()
export default class VerifyEmailModal extends Component {

  state = {
    emailSent: false,
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.verifications.email.loading && !nextProps.verifications.email.loading && nextProps.verifications.email.loaded) {
      // Verification email was sent successfully
      this.setState({ emailSent: true })
    }
  }

  render() {

    const { emailSent } = this.state
    const { dispatch, t, token, verifyEmailModal, user } = this.props

    return (
      <Modal show={verifyEmailModal.open} bsSize='small'>
        <Modal.Header>
          <Modal.Title>{t('common.verifications_modal_title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!emailSent &&
            <span>
              <Row>
                <Col xs={12}>
                  <p>{t('common.verifications_modal_subtitle')}</p>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <p>{t('common.your_email_is')}: {user.data.email}</p>
                </Col>
              </Row>
            </span>
          }
          {emailSent &&
            <Row>
              <Col xs={12}>
                <p>{t('common.confirmation_email_sent')}</p>
              </Col>
            </Row>
          }
        </Modal.Body>
        <Modal.Footer>
          {!emailSent &&
            <span>
              <Button bsStyle='primary' block onClick={() => dispatch(requestVerificationEmail(token))}>{t('common.resend_confirmation_email')}</Button>
              <div style={styles.or}>{t('common.words.or')}</div>
            </span>
          }
          <Button onClick={() => dispatch(closeVerifyEmailModal())} block>{t('common.hide_alert')}</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

VerifyEmailModal.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  verifyEmailModal: PropTypes.func,
  verifications: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
