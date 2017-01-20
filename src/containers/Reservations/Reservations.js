// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row, Panel } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { loadReservations } from 'redux/modules/privateData/reservations/reservations'
import { Table } from 'reactable'
import { uiDate } from 'utils/dates'
import config from 'config'
import Currencies from 'data/constants/Currencies'
import Fees from 'data/constants/Fees'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import styles from './Reservations.styles'

@connect(
  state => ({
    token: state.auth.token,
    reservations: state.privateData.reservations,
  }),
)
@translate()
export default class Reservations extends Component {

  componentDidMount = () => {
    const { dispatch, token } = this.props
    dispatch(loadReservations(token))
  }

  render() {

    const { reservations, t } = this.props

    const data = []
    reservations.data.map(reservation => {
      data.push({
        [t('reservations.sections.guest')]: (
          <div>
            <img style={styles.guestPhoto} src={`${config.img}${reservation.guestPhoto ? reservation.guestPhoto : '/users/default.jpg'}`} alt={reservation.guestName} />
          </div>
        ),
        [t('reservations.sections.status')]: t(`reservations.status_codes.${reservation.status}`),
        [t('reservations.sections.location_details')]: (
          <div>
            <div>{uiDate(reservation.arrivalDate)} / {uiDate(reservation.departureDate)}</div>
            <div>{reservation.homeAddress ? <span>{reservation.homeAddress.street}, {reservation.homeAddress.city}</span> : <span>{t('trips.not_applicable')}</span>}</div>
          </div>
        ),
        [t('reservations.sections.details')]: `${Currencies[reservation.chargesCurrency]}${(reservation.baseCharges * ((100 - Fees.maximumServiceFee) / 100)).toFixed(2)}`,
      })
    })

    return (

      <div>
        <Helmet title={t('reservations.title')} />
        <Grid>
          <Row style={styles.h1Row}>
            <Col xs={12}>
              <h1>{t('reservations.title')}</h1>
              <h5 className='text-muted'>{t('reservations.subtitle')}</h5>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <SpinLoader show={reservations.loading}>
                <Panel style={styles.mainPanel}>
                  <Table
                    className='table'
                    data={data}
                    itemsPerPage={5}
                    sortable
                  />
                </Panel>
              </SpinLoader>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

Reservations.propTypes = {
  dispatch: PropTypes.func,
  reservations: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
