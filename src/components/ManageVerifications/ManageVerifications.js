// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Modal, Row, Well } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { requestVerificationEmail } from 'redux/modules/verifications'
import ManagePhoneNumbers from 'components/ManagePhoneNumbers/ManagePhoneNumbers'
import Dropzone from 'react-dropzone'
import jwtDecode from 'jwt-decode'
import superagent from 'superagent'

// Relative imports
import styles from './ManageVerifications.styles'

@connect(state => ({
  jwt: state.auth.token,
  user: state.privateData.user.data,
}))
@translate()
export default class ManageVerifications extends Component {

  state = {
    idModalIsOpen: false,
    successModalIsOpen: false,
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles, rejectedFiles)

    if (acceptedFiles.length > 0) {

      const { jwt } = this.props

      const request = superagent.post(`/upload/users/${jwtDecode(jwt).rid}/id`)
      request.set({ abroadauth: `Bearer ${(jwt)}` })

      acceptedFiles.forEach(file => {
        request.attach('photos', file)
      })

      request.end(err => {

        if (!err) {
          this.closeModal('id')
          this.openModal('success')
        }

      })
    }
  }

  closeModal = modalName => {
    this.setState({ [`${modalName}ModalIsOpen`]: false })
  }

  openModal = modalName => {
    this.setState({ [`${modalName}ModalIsOpen`]: true })
  }

  render() {

    console.log(this)

    const {
      user,
      t,
      token,
      dispatch,
    } = this.props

    return (
      <Row>
        <Col xs={12}>
          <Well style={styles.section}>
            <h4>
              {t('admin.verifications_email_title')}
              {user.verifications.email ? <FontAwesome name='check-circle' style={styles.verificationIcon} /> : <FontAwesome name='times-circle' style={styles.verificationIcon} />}
            </h4>
            {!user.verifications.email &&
              <div style={styles.sectionContent}>
                <a onClick={() => dispatch(requestVerificationEmail(token))}>{t('admin.verifications_email_button')}</a>
              </div>
            }
          </Well>
          <Well style={styles.section}>
            <h4>
              {t('admin.verifications_phone_title')}
              {user.verifications.phone ? <FontAwesome name='check-circle' style={styles.verificationIcon} /> : <FontAwesome name='times-circle' style={styles.verificationIcon} />}
            </h4>
            {!user.verifications.phone &&
              <div style={styles.sectionContent}>
                <ManagePhoneNumbers {...this.props} />
              </div>
            }
          </Well>

          <Well style={styles.section}>
            <h4>
              {t('admin.verifications_id_title')}
              {user.verifications.id ? <FontAwesome name='check-circle' style={styles.verificationIcon} /> : <FontAwesome name='times-circle' style={styles.verificationIcon} />}
            </h4>
            {!user.verifications.id &&
              <div>
                <div style={styles.sectionContent}>
                  <a onClick={() => this.openModal('id')}>{t('admin.upload_id')}</a>
                </div>
                <Modal
                  onHide={() => this.closeModal('id')}
                  show={this.state.idModalIsOpen}
                  bsSize='small'
                >
                  <div style={styles.modalContent}>
                    <h3>{t('admin.upload_id')}</h3>
                    <Dropzone onDrop={this.onDrop}>
                      <div>{t('admin.upload_id_explanation')}</div>
                    </Dropzone>
                  </div>
                </Modal>
                <Modal
                  onHide={() => this.closeModal('success')}
                  show={this.state.successModalIsOpen}
                  bsSize='small'
                >
                  <div style={styles.modalContent}>
                    <h3>{t('admin.upload_id_success_title')}</h3>
                    <p>{t('admin.upload_id_success_paragraph')}</p>
                  </div>
                </Modal>
              </div>
            }
          </Well>

        </Col>
      </Row>
    )
  }
}

ManageVerifications.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
