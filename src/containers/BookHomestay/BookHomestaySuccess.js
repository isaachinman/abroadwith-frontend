// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Grid, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { translate } from 'react-i18next'

@connect(
  state => ({
    jwt: state.auth.jwt,
  })
)
@translate()
export default class BookHomestaySuccessPage extends Component {

  render() {
    const { jwt, t } = this.props
    return (
      <Grid>
        <Helmet title={t('booking.success_title')} />
        <Row style={{ marginTop: 50 }}>
          <Col xs={12} sm={8} smOffset={2} lg={6} lgOffset={3}>
            <h1>{t('booking.success_title')}</h1>
            <p>{t('booking.success_message')}</p>
            <Link to={`/user/${jwt.rid}`}>
              <Button bsSize='xsmall' bsStyle='success' style={{ marginTop: 15 }}>{t('common.navbar_profile')}</Button>
            </Link>
          </Col>
        </Row>
      </Grid>
    )
  }
}

BookHomestaySuccessPage.propTypes = {
  jwt: PropTypes.object,
  t: PropTypes.func,
}
