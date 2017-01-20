// Absolute imports
import { Col, Grid, Row, Panel } from 'react-bootstrap'
import Helmet from 'react-helmet'
import React, { Component } from 'react'
import { translate } from 'react-i18next'

@translate()
export default class Reservations extends Component {

  render() {
    const { t } = this.props
    return (

      <div>
        <Helmet title={t('reservations.title')} />
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>{t('reservations.title')}</h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Panel>
                Reservations
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

Reservations.propTypes = {
  t: React.PropTypes.func,
}
