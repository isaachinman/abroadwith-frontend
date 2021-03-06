// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Modal, Row, Well } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { requestVerificationEmail } from 'redux/modules/privateData/users/verifications'
import ManagePhoneNumbers from 'components/ManagePhoneNumbers/ManagePhoneNumbers'
import Dropzone from 'react-dropzone'
import jwtDecode from 'jwt-decode'
import { SpinLoader } from 'components'
import superagent from 'superagent'

// Relative imports
import styles from './ManageVerifications.styles'

@connect(state => ({
  user: state.privateData.user.data,
}))
@translate()
export default class ManageVerifications extends Component {

  state = {
    loading: false,
    idModalIsOpen: false,
    successModalIsOpen: false,
  }

  onDrop = acceptedFiles => {

    if (acceptedFiles.length > 0) {

      this.setState({ loading: true })

      const { token } = this.props

      const request = superagent.post(`/upload/users/${jwtDecode(token).rid}/id`)
      request.set({ abroadauth: `Bearer ${(token)}` })

      acceptedFiles.forEach(file => {
        request.attach('photos', file)
      })

      request.end(err => {

        if (!err) {
          this.closeModal('id')
          this.openModal('success')
        }

        this.setState({ loading: false })

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

    const {
      user,
      t,
      token,
      dispatch,
    } = this.props

    console.log(this)

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
                <ManagePhoneNumbers dismissable {...this.props} />
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
                  <SpinLoader show={this.state.loading}>
                    <div style={styles.modalContent}>
                      <h3>{t('admin.upload_id')}</h3>
                      <Dropzone
                        className='basic-dropzone'
                        activeClassName='basic-dropzone-active'
                        onDrop={this.onDrop}
                      >
                        <div>{t('admin.upload_id_explanation')}</div>
                      </Dropzone>
                    </div>
                  </SpinLoader>
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
