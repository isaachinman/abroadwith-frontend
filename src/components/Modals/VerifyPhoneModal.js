// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Modal, Row, Well } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { requestVerificationEmail } from 'redux/modules/privateData/users/verifications'

@connect(state => ({
  user: state.privateData.user.data,
}))
@translate()
export default class VerifyPhoneModal extends Component {

  state = {
    idModalIsOpen: false,
    successModalIsOpen: false,
  }

  closeModal = modalName => {
    this.setState({ [`${modalName}ModalIsOpen`]: false })
  }

  openModal = modalName => {
    this.setState({ [`${modalName}ModalIsOpen`]: true })
  }

  render() {

    const {
      user,
      t,
      token,
      dispatch,
    } = this.props

    return (
      <Modal>
        <Row>
          <Col xs={12}>
            <Well>
              <h4>
                {t('admin.verifications_email_title')}
                {user.verifications.email ? <FontAwesome name='check-circle' /> : <FontAwesome name='times-circle' />}
              </h4>
              {!user.verifications.email &&
                <div>
                  <a onClick={() => dispatch(requestVerificationEmail(token))}>{t('admin.verifications_email_button')}</a>
                </div>
              }
            </Well>
          </Col>
        </Row>
      </Modal>
    )
  }
}

VerifyPhoneModal.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
