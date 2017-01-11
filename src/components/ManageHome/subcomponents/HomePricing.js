// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'

@translate()
export default class HomePricing extends Component {

  render() {

    return (

      <Row>
        <Col xs={12}>
          HomePricing
        </Col>
      </Row>

    )
  }
}

HomePricing.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
