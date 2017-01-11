// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'

@translate()
export default class HomeDescription extends Component {

  render() {

    return (

      <Row>
        <Col xs={12}>
          HomeDescription
        </Col>
      </Row>

    )
  }
}

HomeDescription.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
