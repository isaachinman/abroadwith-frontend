// Absolute imports
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, ControlLabel, FormControl, Row } from 'react-bootstrap'
import { SimpleSelect as Select } from 'react-selectize'
import Dropzone from 'react-dropzone'
import UserLanguages from 'data/constants/UserLanguages'

@translate()
export default class UploadTeacherCertifications extends Component {

  render() {
    const { t } = this.props
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
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ControlLabel>{t('manage_home.certificate_language_label')}*</ControlLabel>
            <Select
              theme='bootstrap3'
              placeholder={t('manage_home.certificate_language_label')}
            >
              {Object.keys(UserLanguages).map(lang => <option value={lang} key={`newcert${lang}`}>{t(`languages.${lang}`)}</option>)}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Dropzone onDrop={this.onDrop}>
              <div>{t('common.drop_files_here')}</div>
            </Dropzone>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button bsStyle='primary'>{t('manage_home.add_certificate_button')}</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

UploadTeacherCertifications.propTypes = {
  t: React.PropTypes.func,
}
