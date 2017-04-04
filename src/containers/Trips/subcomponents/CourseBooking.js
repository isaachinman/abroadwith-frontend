// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col as BootstrapCol, Grid, Row } from 'react-bootstrap'
import { cancelCourseBooking } from 'redux/modules/privateData/bookings/courseBookings'
import config from 'config'
import { connect } from 'react-redux'
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
  courseHero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_course_booking.jpg)`,
    '@media (max-width: 1000px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_course_booking.jpg?w=1000)`,
    },
    '@media (max-width: 600px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_course_booking.jpg?w=600)`,
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
export default class CourseBooking extends Component {

  cancelCourseBooking = () => {

    const { booking, dispatch, token } = this.props
    dispatch(cancelCourseBooking(token, booking.id))

  }

  render() {

    const { booking, t } = this.props

    // Luckily these things are at least named consistently
    const isApproved = booking.status.indexOf('APPROVED') > -1
    const isCancelled = booking.status.indexOf('CANCELLED') > -1
    // const isDeclined = booking.status.indexOf('DECLINED') > -1
    const isPending = booking.status.indexOf('PENDING') > -1

    // Defining today as 23:39 of yesterday takes care of edge cases where booking starts today
    const today = moment().startOf('day').subtract(1, 'minutes')

    // Pending and Approved bookings in the future are actionable
    const isActionable = (isApproved || isPending) && moment(booking.startDate).isAfter(today)

    // Only specific statuses have receipts
    const hasReceipt = isApproved || isCancelled

    return (
      <div style={{ marginBottom: 60 }}>

        <div style={styles.courseHero}>
          <Grid style={styles.heroTextContent}>
            <Row>
              <Col xs={12}>
                <h1>{t('trips.your_language_course')}</h1>
                <h5>{t('trips.course_with', { language: t(`languages.${booking.language}`), school_name: booking.educatorName, country: t(`countries.${booking.address.country}`) })}</h5>
              </Col>
            </Row>
          </Grid>
        </div>

        <div style={styles.contentContainer}>

          <div style={styles.centerLine} />

          <Row style={styles.mainInfoRow}>
            <Col xs={12} sm={6} md={3} style={styles.mainInfoRowSection}>
              <small className='text-muted'>{t('trips.start_date')}</small>
              <h5>{uiDate(booking.startDate)}</h5>
            </Col>
            <Col xs={12} sm={6} md={3} style={styles.mainInfoRowSection}>
              <small className='text-muted'>{t('trips.end_date')}</small>
              <h5>{uiDate(booking.endDate)}</h5>
            </Col>
            <Col xs={12} sm={6} md={3} style={styles.mainInfoRowSection}>
              <small className='text-muted'>{t('trips.course_name')}</small>
              <h5>{booking.courseName}</h5>
            </Col>
            <Col xs={12} sm={6} md={3} style={styles.mainInfoRowSectionLast}>
              <small className='text-muted'>{t('trips.level')}</small>
              <h5>{booking.courseLevel}</h5>
            </Col>
          </Row>
          <div style={styles.infoSection}>
            <Row>
              <Col xs={12} md={6} style={styles.infoSectionTop}>
                <h4 className='text-muted'>{t('trips.status')}</h4>
                <p><strong>{t(`trips.status_codes.${booking.status}`)}</strong></p>
                {hasReceipt &&
                  <p><Link to={`/receipt/course/student/${booking.id}`}>{t('trips.view_receipt')}</Link></p>
                }
                {booking.invoiceIds && booking.invoiceIds.length > 0 &&
                  <p>
                    {t('trips.invoices')}: {booking.invoiceIds.map(id => <Link to={`/invoice/course/student/${id}`} key={`invoice-${id}`}>{t('trips.invoice')} #{id}{booking.invoiceIds.indexOf(id) !== booking.invoiceIds.length - 1 && <span>,&nbsp;</span>}</Link>)}
                  </p>
                }
                {isActionable &&
                  <PopConfirm onConfirm={this.cancelCourseBooking} placement='top' title={t('common.are_you_sure')} okText={t('common.words.Yes')} cancelText={t('common.words.No')}>
                    <Button bsSize='xsmall' bsStyle='danger'>{t('trips.actions.cancel')}</Button>
                  </PopConfirm>
                }
              </Col>
              <Col xs={12} md={6} style={styles.infoSectionTop}>
                <h4 className='text-muted'>{t('common.Details')}</h4>
                {booking.hoursPerWeek &&
                  <div>{t('trips.hours_per_week')}: {booking.hoursPerWeek}</div>
                }
                {booking.type &&
                  <div>{t('trips.educator_type')}: {booking.type === 'SCHOOL' ? <span>{t('trips.school')}</span> : <span>{t('trips.tutor')}</span>}</div>
                }
              </Col>
            </Row>

            {/* The bottom two sections are only shown for approved bookings */}
            {isApproved &&

              <Row>
                <Col xs={12} md={6} style={styles.infoSectionBottom}>
                  <h4 className='text-muted'>{t('trips.location')}</h4>
                  {booking.address.street}{booking.address.complement && <span>, {booking.address.complement}</span>}
                  <br />
                  {booking.address.neighbourhood && <span>{booking.address.neighbourhood}, </span>}{booking.address.city} {booking.address.zipCode}
                  <br />
                  {booking.address.state && <span>{booking.address.state}, </span>}{t(`countries.${booking.address.country}`)}
                </Col>
                <Col xs={12} md={6} style={styles.infoSectionBottom}>
                  <h4 className='text-muted'>{t('common.contact')}</h4>
                  {booking.contactPersonName && <div>{booking.contactPersonName}</div>}
                  {booking.email && <div>{booking.email}</div>}
                  {booking.phoneNumber && <div>{booking.phoneNumber}</div>}
                </Col>
              </Row>
            }

          </div>
        </div>
        {this.props.id}
      </div>
    )
  }
}

CourseBooking.propTypes = {
  booking: PropTypes.object,
  dispatch: PropTypes.func,
  id: PropTypes.number,
  t: PropTypes.func,
  token: PropTypes.string,
}
