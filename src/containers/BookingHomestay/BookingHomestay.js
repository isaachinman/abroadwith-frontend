// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

@translate()
export default class ContactUs extends Component {

  render() {
    const { t } = this.props
    return (
      <Grid>
        <Helmet title={t('contact.title')} />
        <Row>
          <Col xs={12} sm={8} smOffset={2} lg={6} lgOffset={3}>
            Booking Homestay Flow
          </Col>
        </Row>
      </Grid>
    )
  }
}

ContactUs.propTypes = {
  t: PropTypes.func,
}
