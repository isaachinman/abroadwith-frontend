import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'

@translate()
export default class ContactUs extends Component {

  render() {
    const { t } = this.props
    return (
      <div>
        {t('contact.title')}
      </div>
    )
  }
}

ContactUs.propTypes = {
  t: PropTypes.func,
}
