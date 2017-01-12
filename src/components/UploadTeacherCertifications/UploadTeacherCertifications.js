// Absolute imports
import React, { Component } from 'react'
import { translate } from 'react-i18next'

@translate()
export default class UploadTeacherCertifications extends Component {

  render() {
    const { t } = this.props
    return (
      <div className='container'>
        <h1>{t('not_found.title')}</h1>
      </div>
    )
  }
}

UploadTeacherCertifications.propTypes = {
  t: React.PropTypes.func,
}
