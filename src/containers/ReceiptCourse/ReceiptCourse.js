// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import config from 'config'
import Currencies from 'data/constants/Currencies'
import { Alert, Button, Col, Panel, Row, Grid } from 'react-bootstrap'
import { connect } from 'react-redux'
import { loadCourseReceipt } from 'redux/modules/privateData/receipts/receipts'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import CourseBookingStatusCodes from 'data/constants/CourseBookingStatusCodes'
// import moment from 'moment'
import { uiDate, semanticDate } from 'utils/dates'
import { translate } from 'react-i18next'

// Relative imports
import styles from './ReceiptCourse.styles'

@asyncConnect([{
  deferred: false,
  promise: ({ params, store: { dispatch, getState } }) => {

    return Promise.resolve(dispatch(loadCourseReceipt(getState().auth.token, params.bookingID)))

  },
}])
@connect(
  (state, ownProps) => ({
    reservation: state.privateData.receipts[`c${ownProps.params.bookingID}`].booking,
  })
)
@translate()
export default class ReceiptCourse extends Component {
  render() {

    const { t, reservation } = this.props

    // const today = moment().startOf('day').subtract(1, 'minutes')
    const bookingPhase = Object.keys(CourseBookingStatusCodes).filter(statusCategory => CourseBookingStatusCodes[statusCategory].indexOf(reservation.status) > -1)[0]

    // const isActionable = ['pending', 'approved'].includes(bookingPhase) && moment(reservation.arrivalDate).isAfter(today)
    const isActionable = false // Currently students cannot cancel bookings

    console.log(this)

    return (
      <div>
        <Helmet title={t('reservations.reservation_details')} />
        {reservation &&
          <Grid>
            <Row style={styles.h1Row}>
              <Col xs={12}>
                <h1>{t('reservations.reservation_details')}</h1>
                <h5 className='text-muted'>{t('trips.status')}: {t(`trips.status_codes.${reservation.status}`)}</h5>
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
                      <div>
                        {reservation.startDate && <div>{semanticDate(t, reservation.startDate)} {t('common.words.to')} {semanticDate(t, reservation.endDate)}</div>}
                        {reservation.educatorName && <div>{reservation.educatorName}</div>}
                        {reservation.courseName && <div>{reservation.courseName}</div>}
                        {reservation.guestPhone && <div>{reservation.guestPhone}</div>}
                      </div>
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
                      <strong>{t('trips.level')}:</strong> {reservation.courseLevel}
                    </Col>
                  </Row>
                  <Row style={styles.bottomBorder}>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.languages')}:</strong> {t(`languages.${reservation.language}`)} {reservation.languageGuestWillTeach && <span>, {t(`languages.${reservation.languageGuestWillTeach}`)}</span>}
                    </Col>
                    <Col xs={6}>
                      <strong>{t('trips.hours_per_week')}:</strong> {reservation.hoursPerWeek}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <strong>{t('common.Location')}:</strong> {reservation.address && reservation.address.street ?
                        <span>{reservation.address.street}, {reservation.address.city}, {t(`countries.${reservation.address.country}`)}</span> : <span>{t('common.deleted_home')}</span>}
                    </Col>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.base_service_fee')}:</strong> {Currencies[reservation.chargesCurrency]}{reservation.chargesWithoutFees}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <strong>{t('admin.contact_info_tabname')}:</strong> {reservation.contactPersonName ?
                        <span>{reservation.contactPersonName}</span>
                        : <span>{t('trips.not_applicable')}</span>}
                    </Col>
                    <Col xs={6}>
                      <strong>{t('trips.invoices')}:</strong> {reservation.invoiceIds.length > 0 ? reservation.invoiceIds.map(invoice => {
                        return (
                          <Link key={`invoicelink${invoice}`} to={`/invoice/course/student/${invoice}`}> {t('trips.invoice')} #{invoice}</Link>
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

ReceiptCourse.propTypes = {
  data: React.PropTypes.object,
  loading: React.PropTypes.bool,
  user: React.PropTypes.object,
  reservation: PropTypes.object,
  t: PropTypes.func,
  error: React.PropTypes.object,
}
