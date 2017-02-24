// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import config from 'config'
import Currencies from 'data/constants/Currencies'
import { Alert, Button, Col, Panel, Row, Grid } from 'react-bootstrap'
import { connect } from 'react-redux'
import { loadReceipt } from 'redux/modules/privateData/receipts/receipts'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import HomestayBookingStatusCodes from 'data/constants/HomestayBookingStatusCodes'
import moment from 'moment'
import { uiDate } from 'utils/dates'
import { translate } from 'react-i18next'

// Relative imports
import styles from './ReceiptHomestay.styles'

@asyncConnect([{
  deferred: false,
  promise: ({ params, store: { dispatch, getState } }) => {

    return Promise.resolve(dispatch(loadReceipt(getState().auth.token, params.bookingID)))

  },
}])
@connect(
  (state, ownProps) => ({
    reservation: state.privateData.receipts[ownProps.params.bookingID].booking,
  })
)
@translate()
export default class ReceiptHomestay extends Component {
  render() {

    const { t, reservation } = this.props

    const today = moment().startOf('day').subtract(1, 'minutes')
    const bookingPhase = Object.keys(HomestayBookingStatusCodes).filter(statusCategory => HomestayBookingStatusCodes[statusCategory].indexOf(reservation.status) > -1)[0]
    const isActionable = ['pending', 'approved'].includes(bookingPhase) && moment(reservation.arrivalDate).isAfter(today)

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
                        {t('common.words.or')}&nbsp;
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
                      <strong>{t('receipts_invoices.immersion_address')}:</strong> {reservation.homeAddress && reservation.homeAddress.street ?
                        <span>{reservation.homeAddress.street}, {reservation.homeAddress.city}, {t(`countries.${reservation.homeAddress.country}`)}</span> : <span>{t('common.deleted_home')}</span>}
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
                          <Link key={`invoicelink${invoice}`} to={`/invoice/${invoice}`}> {t('trips.invoice')} #{invoice}</Link>
                        )
                      }) : <span> {t('trips.not_applicable')}</span>}
                    </Col>
                  </Row>
                </Panel>
              </Col>
            </Row>
          </Grid>
        }
      </div>
    )
  }
}

ReceiptHomestay.propTypes = {
  data: React.PropTypes.object,
  loading: React.PropTypes.bool,
  user: React.PropTypes.object,
  reservation: PropTypes.object,
  t: PropTypes.func,
  error: React.PropTypes.object,
}
