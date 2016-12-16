// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Row } from 'react-bootstrap'
import { translate } from 'react-i18next'

@translate()
export default class ManagePhoneNumbers extends Component {
  render() {

    // const {
    //   user,
    //   t,
    // } = this.props

    return (
      <Row>

        Verify and add phone numbers module

      </Row>
    )
  }
}

ManagePhoneNumbers.propTypes = {
  updateUser: PropTypes.func,
  user: PropTypes.object,
  t: PropTypes.func,
}
