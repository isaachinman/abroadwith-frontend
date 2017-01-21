// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Col, Grid, Panel, Row } from 'react-bootstrap'
import { uiDate } from 'utils/dates'
import { Link } from 'react-router'
import config from 'config'
import Currencies from 'data/constants/Currencies'
import Helmet from 'react-helmet'

// Styles
import styles from './ReservationDetails.styles'

@connect(
  (state, ownProps) => ({
    reservation: state.privateData.reservations.data.filter(reservation => reservation.id === parseInt(ownProps.routeParams.reservationID))[0],
  }),
)
@translate()
export default class ReservationDetails extends Component {

  render() {

    const { reservation, t } = this.props

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
                          <div><strong>{t('receipts_invoices.guest_name')}:</strong> {reservation.guestName}</div>
                          <div><strong>{t('common.Email')}:</strong> {reservation.guestEmail ? <span>reservation.guestEmail</span> : <span>{t('trips.not_applicable')}</span>}</div>
                          <div><strong>{t('users.phone_number_label')}:</strong> {reservation.guestPhone ? <span>reservation.guestPhone</span> : <span>{t('trips.not_applicable')}</span>}</div>
                        </div>
                      }
                      {!reservation.guestId && <span><strong>{t('receipts_invoices.guest_name')}:</strong> {t('common.deleted_account')}</span>}
                    </Col>
                  </Row>
                </Panel>
              </Col>
              <Col xs={12} md={8}>
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
                      <strong>{t('admin.contact_info_emergency_contact_title')}:</strong> {reservation.guestEmergencyContact ? <span>{reservation.guestEmergencyContact}</span> : <span>{t('trips.not_applicable')}</span>}
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

ReservationDetails.propTypes = {
  reservation: PropTypes.object,
  t: PropTypes.func,
}
