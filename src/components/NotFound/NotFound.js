// Absolute imports
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import Helmet from 'react-helmet'

@translate()
export default class NotFound extends Component {

  render() {
    const { t } = this.props
    return (
      <div className='container'>
        <Helmet title={t('not_found.title')} />
        <h1>{t('not_found.title')}</h1>
      </div>
    )
  }
}

NotFound.propTypes = {
  t: React.PropTypes.func,
}
