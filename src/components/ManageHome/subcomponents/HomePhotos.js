// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'

@translate()
export default class HomePhotos extends Component {

  render() {

    return (

      <Row>
        <Col xs={12}>
          HomePhotos
        </Col>
      </Row>

    )
  }
}

HomePhotos.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
