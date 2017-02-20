// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col, Grid, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'

// Relative imports
import styles from '../Trips.styles'

@connect()
@translate()
export default class HomestayBooking extends Component {

  render() {

    const { booking, t } = this.props

    console.log(this)

    return (
      <div>
        <div style={styles.homestayHero}>

          <Grid style={styles.heroTextContent}>
            <Row>
              <Col xs={12}>
                <h1>{t('trips.your_homestay')}</h1>
                <h5>{t('trips.trip_with', { immersion: t(`immersions.${booking.immersionType}`), host: booking.hostName, country: t(`countries.${booking.homeAddress.country}`) })}</h5>
              </Col>
            </Row>
          </Grid>

        </div>
      </div>
    )
  }
}

HomestayBooking.propTypes = {
  booking: PropTypes.object,
  dispatch: PropTypes.func,
  t: PropTypes.func,
}
