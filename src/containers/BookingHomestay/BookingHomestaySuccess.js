// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

@translate()
export default class BookingHomestaySuccessPage extends Component {

  render() {
    const { t } = this.props
    return (
      <Grid>
        <Helmet title={t('booking.success_title')} />
        <Row style={{ marginTop: 50 }}>
          <Col xs={12} sm={8} smOffset={2} lg={6} lgOffset={3}>
            <h1>{t('booking.success_title')}</h1>
            <p>{t('booking.success_message')}</p>
          </Col>
        </Row>
      </Grid>
    )
  }
}

BookingHomestaySuccessPage.propTypes = {
  t: PropTypes.func,
}
