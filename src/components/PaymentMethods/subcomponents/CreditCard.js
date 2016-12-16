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
export default class CreditCard extends Component {

  render() {

    return (
      <Row>
        <Col xs={12} md={6} lg={3}>
          Credit card
        </Col>
      </Row>
    )
  }
}

CreditCard.propTypes = {
  type: PropTypes.string,
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
}
