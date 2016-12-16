// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

@connect(state => ({
  jwt: state.auth.token,
  user: state.privateData.user.data,
}))
@translate()
export default class PaymentMethods extends Component {

  render() {

    // const {
    //   user,
    //   jwt,
    //   t,
    //   dispatch,
    // } = this.props

    return (
      <Row>
        <Col xs={12} md={6} lg={3}>
          Braintree init here
        </Col>
      </Row>
    )
  }
}

PaymentMethods.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
}
