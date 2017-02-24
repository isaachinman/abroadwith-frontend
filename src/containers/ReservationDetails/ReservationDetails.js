// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Alert, Button, Col, Grid, Panel, Row } from 'react-bootstrap'
import { uiDate } from 'utils/dates'
import { loadReservations, approveReservation, cancelReservation, declineReservation } from 'redux/modules/privateData/reservations/reservations'
import { Link } from 'react-router'
import config from 'config'
import Currencies from 'data/constants/Currencies'
import Helmet from 'react-helmet'
import HomestayBookingStatusCodes from 'data/constants/HomestayBookingStatusCodes'
import SpinLoader from 'components/SpinLoader/SpinLoader'
import { translate } from 'react-i18next'
import moment from 'moment'

// Styles
import styles from './ReservationDetails.styles'

@connect(
  (state, ownProps) => ({
    reservations: state.privateData.reservations,
    reservation: state.privateData.reservations.data.filter(reservation => reservation.id === parseInt(ownProps.routeParams.reservationID))[0],
    token: state.auth.token,
  }),
)
@translate()
export default class ReservationDetails extends Component {

  componentDidMount = () => {
    const { dispatch, reservation, token } = this.props
    if (!reservation) {
      dispatch(loadReservations(token))
    }
  }

  approveReservation = reservationID => {
    const { dispatch, token } = this.props
    dispatch(approveReservation(token, reservationID, true))
  }

  cancelReservation = reservationID => {
    const { dispatch, token } = this.props
    dispatch(cancelReservation(token, reservationID, true))
  }

  declineReservation = reservationID => {
    const { dispatch, token } = this.props
    dispatch(declineReservation(token, reservationID, true))
  }

  render() {

    const { reservations, reservation, t } = this.props

    // Determine if reservation can have actions performed upon it
    // TODO: still need to compare the arrival date to today's date
    // and then render a panel with action buttons if it's good to go
    const today = moment().startOf('day').subtract(1, 'minutes')
    console.log(today, moment(reservation.arrivalDate))
    console.log()
    const bookingPhase = Object.keys(HomestayBookingStatusCodes).filter(statusCategory => HomestayBookingStatusCodes[statusCategory].indexOf(reservation.status) > -1)[0]
    const isActionable = ['pending', 'approved'].includes(bookingPhase) && moment(reservation.arrivalDate).isAfter(today)

    console.log('isActionable: ', isActionable)

    console.log(this)

    return (
      <div>
        <Helmet title={t('reservations.reservation_details')} />
        {reservation &&
          <Grid>
            <Row style={styles.h1Row}>
              <Col xs={12}>
                <h1>{t('reservations.reservation_details')}</h1>
                <h5 className='text-muted'>{t('trips.reservation_code')}: {reservation.code}</h5>
              </Col>
            </Row>
            <SpinLoader show={reservations.loading}>
              <Row>
                <Col xs={12} md={4}>
                  <Panel style={styles.panel}>
                    <Row>
                      <Col xs={12} style={styles.centerAlign}>
                        <img style={styles.guestPhoto} src={`${config.img}${reservation.guestPhoto ? reservation.guestPhoto : '/users/default.jpg'}`} alt={reservation.guestName} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        {reservation.guestId &&
                          <div>
                            <div>{reservation.guestName && <span>{reservation.guestName}</span>}</div>
                            <div>{reservation.guestEmail && <span>{reservation.guestEmail}</span>}</div>
                            <div>{reservation.guestPhone && <span>{reservation.guestPhone}</span>}</div>
                          </div>
                        }
                        {!reservation.guestId && <span><strong>{t('receipts_invoices.guest_name')}:</strong> {t('common.deleted_account')}</span>}
                      </Col>
                    </Row>
                  </Panel>
                </Col>
                <Col xs={12} md={8}>
                  {isActionable &&
                    <Panel>
                      <Row>
                        {bookingPhase === 'pending' &&
                          <Col xs={12}>
                            <h5>{t('trips.actions_title')}:</h5>
                            <Alert style={styles.alert}>
                              <Button onClick={() => this.approveReservation(reservation.id)} bsStyle='primary'>{t('trips.actions.approve')}</Button>
                              &nbsp;{t('common.words.or')}&nbsp;
                              <Button onClick={() => this.declineReservation(reservation.id)} bsStyle='danger'>{t('trips.actions.decline')}</Button>
                            </Alert>
                          </Col>
                        }
                        {bookingPhase === 'approved' &&
                          <Col xs={12}>
                            <h5>{t('trips.actions_title')}:</h5>
                            <Alert bsStyle='danger' style={styles.alert}>
                              <Button onClick={() => this.cancelReservation(reservation.id)} bsStyle='danger'>{t('trips.actions.cancel')}</Button>
                            </Alert>
                          </Col>
                        }
                      </Row>
                    </Panel>
                  }
                  <Panel style={styles.panel}>
                    <Row>
                      <Col xs={6}>
                        <strong>{t('receipts_invoices.arrival')}: </strong> {uiDate(reservation.arrivalDate)}
                      </Col>
                      <Col xs={6}>
                        <strong>{t('receipts_invoices.departure')}: </strong> {uiDate(reservation.departureDate)}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <strong>{t('receipts_invoices.status')}:</strong> {t(`reservations.status_codes.${reservation.status}`)}
                      </Col>
                      <Col xs={6}>
                        <strong>{t('receipts_invoices.immersion_type')}:</strong> {t(`immersions.${reservation.immersionType}`)}
                      </Col>
                    </Row>
                    <Row style={styles.bottomBorder}>
                      <Col xs={6}>
                        <strong>{t('receipts_invoices.languages')}:</strong> {t(`languages.${reservation.languageHostWillTeach}`)} {reservation.languageGuestWillTeach && <span>, {t(`languages.${reservation.languageGuestWillTeach}`)}</span>}
                      </Col>
                      <Col xs={6}>
                        <strong>{t('trips.room_name')}:</strong> {reservation.roomName}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <strong>{t('receipts_invoices.immersion_address')}:</strong> {reservation.homeAddress && reservation.homeAddress.street && <span>{reservation.homeAddress.street}, {reservation.homeAddress.city}, {t(`countries.${reservation.homeAddress.country}`)}</span>}
                      </Col>
                      <Col xs={6}>
                        <strong>{t('immersions.hours_per_week_label')}:</strong> {reservation.weeklyHours}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <strong>{t('receipts_invoices.base_service_fee')}:</strong> {Currencies[reservation.chargesCurrency]}{reservation.baseCharges}
                      </Col>
                      <Col xs={6}>
                        <strong>{t('common.Guests')}:</strong> {reservation.guestCount}
                      </Col>
                    </Row>
                    <Row style={styles.bottomBorder}>
                      <Col xs={6}>
                        <strong>{t('trips.services')}:</strong> {reservation.homeServices.length > 0 ?
                          reservation.homeServices.map((service, index) => <span key={`service${service}`}>{t(`trips.home_services.${service}`)}{index !== reservation.homeServices.length - 1 && <span>, </span>}</span>) :
                          <span>{t('trips.not_applicable')}</span>}
                      </Col>
                      <Col xs={6}>
                        <strong>{t('receipts_invoices.home_settings')}:</strong> {reservation.homeSettings.length > 0 ?
                          reservation.homeSettings.map((setting, index) => <span key={`setting${setting}`}>{setting}{index !== reservation.homeServices.length - 1 && <span>, </span>}</span>) :
                          <span>{t('trips.not_applicable')}</span>}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <strong>{t('admin.contact_info_emergency_contact_title')}:</strong> {reservation.guestEmergencyContact ?
                          <span>
                            {reservation.guestEmergencyContact.name && <span>{reservation.guestEmergencyContact.name}</span>}
                            {reservation.guestEmergencyContact.relationship && <span> ({reservation.guestEmergencyContact.relationship})</span>}
                            {reservation.guestEmergencyContact.email && <span>, {reservation.guestEmergencyContact.email}</span>}
                            {reservation.guestEmergencyContact.phone && <span>, {reservation.guestEmergencyContact.phone}</span>}
                          </span>
                          : <span>{t('trips.not_applicable')}</span>}
                      </Col>
                      <Col xs={6}>
                        <strong>{t('trips.invoices')}:</strong> {reservation.invoiceIds.length > 0 ? reservation.invoiceIds.map(invoice => {
                          return (
                            <Link key={`invoicelink${invoice}`} to={`/invoice/homestay/host/${invoice}`}> {t('trips.invoice')} #{invoice}</Link>
                          )
                        }) : <span> {t('trips.not_applicable')}</span>}
                      </Col>
                    </Row>
                  </Panel>
                </Col>
              </Row>
            </SpinLoader>
          </Grid>
        }
      </div>

    )
  }
}

ReservationDetails.propTypes = {
  dispatch: PropTypes.func,
  reservation: PropTypes.object,
  reservations: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
