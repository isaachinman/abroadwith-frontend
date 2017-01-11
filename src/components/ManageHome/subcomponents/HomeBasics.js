// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Col, FormControl, Row } from 'react-bootstrap'

@translate()
export default class HomeBasics extends Component {

  render() {

    const { t } = this.props

    return (

      <Row>
        <Col xs={12}>
          <FormControl
            type='text'
            placeholder={t('manage_home.location.address_line_1')}
            onChange={event => this.handleNameChange(event, 'first')}
          />
        </Col>
      </Row>

    )
  }
}

HomeBasics.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
