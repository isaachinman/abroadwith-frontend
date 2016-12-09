// Absolute imports
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'


@connect(state => ({ user: state.privateData.user.data }))
@translate()
export default class UserProfile extends Component {
  render() {

    console.log(this)

    const { t } = this.props

    return (
      <div>

        <Helmet title={t('admin.title')} />


      </div>
    )
  }
}

UserProfile.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
}
