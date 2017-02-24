// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col as BootstrapCol, Grid, Row } from 'react-bootstrap'
import { cancelHomestayBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import config from 'config'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import { darkBlue } from 'styles/colors'
import { Link } from 'react-router'
import moment from 'moment'
import PopConfirm from 'antd/lib/popconfirm'
import Radium from 'radium'
import { uiDate } from 'utils/dates'
import { translate } from 'react-i18next'

// Radium-wrapped Col
const Col = Radium(BootstrapCol)

// Styles
const styles = {
  contentContainer: {
    padding: '0 15px',
    background: 'rgba(0,0,0,.045)',
    position: 'relative',
  },
  homestayHero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_testimonials.jpeg)`,
    '@media (max-width: 1000px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_testimonials.jpeg?w=1000)`,
    },
    '@media (max-width: 600px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_testimonials.jpeg?w=600)`,
    },
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: darkBlue,
    color: 'white',
    height: '50vh',
    minHeight: 420,
    '@media (max-width: 350px)': {
      minHeight: 460,
    },
  },
  heroTextContent: {
    maxWidth: 600,
    margin: '0 auto',
    textShadow: '1px 2px 2px rgba(0, 0, 0, .2)',
  },
  mainInfoRow: {
    textAlign: 'center',
    border: '1px solid #ddd',
  },
  mainInfoRowSection: {
    background: 'white',
    borderRight: '1px solid #ddd',
    padding: '15px 0 10px 0',
    '@media (max-width: 991px)': {
      borderRight: 'none',
    },
  },
  mainInfoRowSectionLast: {
    background: 'white',
    padding: '15px 0 10px 0',
  },
  infoSection: {
    position: 'relative',
  },
  centerLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    background: '#ddd',
    top: 0,
    left: 'calc(50% - 1px)',
    '@media(max-width: 991px)': {
      display: 'none',
    },
  },
  infoSectionTop: {
    padding: '0 30px 30px 30px',
  },
  infoSectionBottom: {
    padding: '30px 30px 40px 30px',
    borderTop: '1px solid #ddd',
    '@media(max-width: 991px)': {
      borderTop: 'none',
    },
  },
}

@connect(
  state => ({
    token: state.auth.token,
  })
)
@translate()
@Radium
export default class HomestayBooking extends Component {

  cancelHomestayBooking = () => {

    const { booking, dispatch, token } = this.props
    dispatch(cancelHomestayBooking(token, booking.id))

  }

  render() {

    const { booking, t } = this.props

    // Luckily these things are at least named consistently
    const isApproved = booking.status.indexOf('APPROVED') > -1
    // const isCancelled = booking.status.indexOf('CANCELLED') > -1
    // const isDeclined = booking.status.indexOf('DECLINED') > -1
    const isPending = booking.status.indexOf('PENDING') > -1

    // Pending and Approved bookings in the future are actionable
    const isActionable = (isApproved || isPending) && moment(booking.arrivalDate).isAfter(moment())

    const currencySymbol = Currencies[booking.chargesCurrency]

    console.log(this)

    return (
      <div style={{ marginBottom: 60 }}>

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

        <div style={styles.contentContainer}>

          <div style={styles.centerLine} />

          <Row style={styles.mainInfoRow}>
            <Col xs={12} sm={6} md={3} style={styles.mainInfoRowSection}>
              <small className='text-muted'>{t('common.duration')}</small>
              <h5>{moment(booking.departureDate).diff(moment(booking.arrivalDate), 'days')} {t('common.days')}</h5>
            </Col>
            <Col xs={12} sm={6} md={3} style={styles.mainInfoRowSection}>
              <small className='text-muted'>{t('booking.total_price')}</small>
              <h5>{currencySymbol}{booking.totalCharges}</h5>
            </Col>
            <Col xs={12} sm={6} md={3} style={styles.mainInfoRowSection}>
              <small className='text-muted'>{t('common.Language')}</small>
              <h5>{t(`languages.${booking.languageHostWillTeach}`)}</h5>
            </Col>
            <Col xs={12} sm={6} md={3} style={styles.mainInfoRowSectionLast}>
              <small className='text-muted'>{t('trips.reservation_code')}</small>
              <h5>{booking.code}</h5>
            </Col>
          </Row>

          <div style={styles.infoSection}>
            <Row>
              <Col xs={12} md={6} style={styles.infoSectionTop}>
                <h4 className='text-muted'>{t('trips.status')}</h4>
                <strong>{t(`trips.status_codes.${booking.status}`)}</strong>
                <p>{t('trips.created')}: {uiDate(booking.created)}</p>
                <p><Link to={`/receipt/homestay/student/${booking.id}`}>{t('trips.view_receipt')}</Link></p>
                {booking.invoiceIds && booking.invoiceIds.length > 0 &&
                  <p>
                    {t('trips.invoices')}: {booking.invoiceIds.map(id => <Link to={`/invoice/homestay/student/${id}`} key={`invoice-${id}`}>{t('trips.invoice')} #{id}{booking.invoiceIds.indexOf(id) !== booking.invoiceIds.length - 1 && <span>,&nbsp;</span>}</Link>)}
                  </p>
                }
                {isActionable &&
                  <PopConfirm onConfirm={this.cancelHomestayBooking} placement='top' title={t('common.are_you_sure')} okText={t('common.words.Yes')} cancelText={t('common.words.No')}>
                    <Button bsSize='xsmall' bsStyle='danger'>{t('trips.actions.cancel')}</Button>
                  </PopConfirm>
                }
              </Col>
              <Col xs={12} md={6} style={styles.infoSectionTop}>
                <h4 className='text-muted'>{t('common.Details')}</h4>
                <p>
                  {t('common.Arrival')}: {uiDate(booking.arrivalDate)}
                  <br />
                  {t('common.Departure')}: {uiDate(booking.departureDate)}
                  <br />
                  {t('common.Guests')}: {booking.guestCount}
                  <br />
                  {t('common.Immersion')}: {t(`immersions.${booking.immersionType}`)}
                  <br />
                  {t('booking.room_name')}: {booking.roomName}
                </p>
              </Col>
            </Row>

            {/* The bottom two sections are only shown for approved bookings */}
            {isApproved &&

              <Row>
                <Col xs={12} md={6} style={styles.infoSectionBottom}>
                  <h4 className='text-muted'>{t('trips.location')}</h4>
                  {booking.homeAddress.street}{booking.homeAddress.complement && <span>, {booking.homeAddress.complement}</span>}
                  <br />
                  {booking.homeAddress.neighbourhood && <span>{booking.homeAddress.neighbourhood}, </span>}{booking.homeAddress.city} {booking.homeAddress.zipCode}
                  <br />
                  {booking.homeAddress.state}, {t(`countries.${booking.homeAddress.country}`)}
                </Col>
                <Col xs={12} md={6} style={styles.infoSectionBottom}>
                  <h4 className='text-muted'>{t('common.host')}</h4>
                  {booking.hostName}
                  <br />
                  {booking.hostEmail}
                  <br />
                  {booking.hostPhone}
                </Col>
              </Row>

            }

          </div>

        </div>
      </div>
    )
  }
}

HomestayBooking.propTypes = {
  booking: PropTypes.object,
  dispatch: PropTypes.func,
  t: PropTypes.func,
  token: PropTypes.func,
}
