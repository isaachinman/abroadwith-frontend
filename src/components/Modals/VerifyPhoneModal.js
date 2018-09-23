// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { updateHomestay } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { closeVerifyPhoneModal } from 'redux/modules/ui/modals'
import ManagePhoneNumbers from 'components/ManagePhoneNumbers/ManagePhoneNumbers'

// Relative imports
import styles from './Modals.styles'

@connect(state => ({
  verifyPhoneModal: state.ui.modals.verifyPhoneModal,
  token: state.auth.token,
}))
@translate()
export default class VerifyPhoneModal extends Component {

  state = {
    verifyProcessStarted: false,
  }

  startProcess = () => this.setState({ verifyProcessStarted: true })

  closeModalWithoutSuccess = () => {
    const { dispatch, verifyPhoneModal } = this.props
    if (verifyPhoneModal.reason === 'HOME_PUBLICATION') {
      dispatch(push('/'))
      setTimeout(() => { dispatch(closeVerifyPhoneModal()) }, 250)
    } else {
      dispatch(closeVerifyPhoneModal())
    }
  }

  render() {

    const { verifyProcessStarted } = this.state

    const {
      dispatch,
      verifyPhoneModal,
      t,
      token,
    } = this.props

    let successCallback = () => {}

    if (verifyPhoneModal.reason === 'HOME_PUBLICATION') {
      successCallback = () => {

        // Now we have to actually POST the home once more to publish it
        dispatch(updateHomestay(token, verifyPhoneModal.additionalData.homeID, verifyPhoneModal.additionalData.homeObject))

      }
    }

    return (
      <span>
        <Modal show={verifyPhoneModal.open && !verifyProcessStarted} bsSize='small'>
          <Modal.Header>
            <Modal.Title>{t('common.verifications_modal_title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {verifyPhoneModal.reason === 'HOME_PUBLICATION' &&
              <Row>
                <Col xs={12}>
                  {t('manage_home.phone_verification_explanation')}
                </Col>
              </Row>
            }
          </Modal.Body>
          <Modal.Footer>
            {verifyPhoneModal.reason === 'HOME_PUBLICATION' &&
              <Button bsStyle='primary' block onClick={this.startProcess}>{t('manage_home.phone_verification_proceed')}</Button>
            }
            <div style={styles.or}>{t('common.words.or')}</div>
            {verifyPhoneModal.reason === 'HOME_PUBLICATION' &&
              <Button onClick={this.closeModalWithoutSuccess} block>{t('manage_home.phone_verification_not_now')}</Button>
            }
          </Modal.Footer>
        </Modal>
        <ManagePhoneNumbers
          modalOnly
          dismissable={!verifyPhoneModal.reason === 'HOME_PUBLICATION'}
          closeModal={this.closeModalWithoutSuccess}
          show={verifyProcessStarted}
          token={token}
          successCallback={successCallback}
        />
      </span>
    )
  }
}

VerifyPhoneModal.propTypes = {
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  verifyPhoneModal: PropTypes.object,
}
