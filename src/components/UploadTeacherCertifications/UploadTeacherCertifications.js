// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { addTeacherCertificate } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { Button, Col, ControlLabel, FormControl, Row } from 'react-bootstrap'
import { SimpleSelect as Select } from 'react-selectize'
import Dropzone from 'react-dropzone'
import UserLanguages from 'data/constants/UserLanguages'

@translate()
export default class UploadTeacherCertifications extends Component {

  state = {
    newCertificate: {
      name: null,
      language: null,
    },
    newCertificateImg: null,
  }

  onDrop = acceptedFiles => {
    this.setState({ newCertificateImg: acceptedFiles[0] })
  }

  addTeacherCertificate = () => {
    const { newCertificate, newCertificateImg } = this.state
    const { dispatch, home, token, routeParams } = this.props
    dispatch(addTeacherCertificate(token, parseInt(routeParams.homeID), home.data, newCertificate, newCertificateImg))
  }

  handleValueChange = (field, value) => {
    const newState = Object.assign({}, this.state)
    newState.newCertificate[field] = value
    this.setState(newState)
  }

  validateForm = () => {
    return !(Object.values(this.state.newCertificate).some(value => !value)) && this.state.newCertificateImg !== null
  }

  render() {

    const { newCertificateImg } = this.state
    const { t } = this.props
    const formIsValid = this.validateForm()
    console.log(formIsValid)
    console.log(this)
    return (
      <div>
        <Row>
          <Col xs={12}>
            <p>{t('manage_home.teacher_cerification_tooltip')}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ControlLabel>{t('manage_home.certificate_name_label')}*</ControlLabel>
            <FormControl
              type='text'
              placeholder={t('manage_home.certificate_name_label')}
              onChange={event => this.handleValueChange('name', event.target.value)}
              maxLength={44}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ControlLabel>{t('manage_home.certificate_language_label')}*</ControlLabel>
            <Select
              theme='bootstrap3'
              placeholder={t('manage_home.certificate_language_label')}
              onValueChange={event => this.handleValueChange('language', event ? event.value : '')}
            >
              {Object.keys(UserLanguages).map(lang => <option value={lang} key={`newcert${lang}`}>{t(`languages.${lang}`)}</option>)}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Dropzone onDrop={this.onDrop}>
              <div>{t('common.drop_files_here')}</div>
              {newCertificateImg &&
                <img src={newCertificateImg.preview} className='dropzone-img' alt='New room' />
              }
            </Dropzone>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button onClick={this.addTeacherCertificate} bsStyle='primary' disabled={!formIsValid}>{t('manage_home.add_certificate_button')}</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

UploadTeacherCertifications.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  routeParams: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
