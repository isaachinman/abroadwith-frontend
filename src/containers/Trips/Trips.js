// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { Button, Col, Panel, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { extendMoment } from 'moment-range'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { loadCourseBookings } from 'redux/modules/privateData/bookings/courseBookings'
import { loadHomestayBookings } from 'redux/modules/privateData/bookings/homestayBookings'
import Moment from 'moment'
import Radium from 'radium'
import { translate } from 'react-i18next'
import { scrollToTopOfPage } from 'utils/scrolling'
import { SpinLoader } from 'components'

// Relative imports
import AddACourseBooking from './subcomponents/AddACourseBooking'
import CourseBooking from './subcomponents/CourseBooking'
import HomestayBooking from './subcomponents/HomestayBooking'
import styles from './Trips.styles'
import TripSelector from './subcomponents/TripSelector'

// Extend moment
const moment = extendMoment(Moment)

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {

    const promises = []

    const token = getState().auth.token

    promises.push(dispatch(loadHomestayBookings(token)))
    promises.push(dispatch(loadCourseBookings(token)))

    return Promise.all(promises)

  },
}])
@connect(
  state => ({
    courseBookings: state.bookings.courseBookings.bookings,
    homestayBookings: state.bookings.homestayBookings.bookings,
    token: state.auth.token,
  }),
)
@translate()
@Radium
export default class Trips extends Component {

  state = {
    activeTripID: null,
    initialised: false,
    trips: [],
  }

  componentWillMount = () => this.compileTrips(true)
  componentDidMount = () => scrollToTopOfPage()

  // Anytime bookings are reloaded, trips must be recompiled
  componentDidUpdate = prevProps => {
    if (this.state.initialised && !this.props.homestayBookings.loading && prevProps.homestayBookings.loading) {
      this.compileTrips()
    }
  }

  changeTrip = activeTripID => {
    this.setState({ activeTripID })
    scrollToTopOfPage()
  }

  determineActiveTrip = trips => {

    // The priority for default active trip is as such:
    // 1) The next trip in the future, or
    // 2) The most recent trip in the past
    const today = moment()
    let nextUpcomingTrip = {
      startDate: today,
      tripId: null,
    }
    let mostRecentTrip = {
      endDate: today,
      tripId: null,
    }

    // Loop through all trips
    Object.keys(trips).map(t => {

      // In this case, we're only going to look at the first booking of each trip
      const booking = trips[t].bookings[0]

      if (booking.bookingType === 'HOMESTAY') {
        if (moment(booking.arrivalDate).isAfter(nextUpcomingTrip.startDate)) {
          nextUpcomingTrip = {
            startDate: moment(booking.arrivalDate),
            tripId: t,
          }
        } else if (moment(booking.departureDate).isBefore(mostRecentTrip.endDate)) {
          mostRecentTrip = {
            endDate: moment(booking.departureDate),
            tripId: t,
          }
        }
      } else if (booking.bookingType === 'COURSE') {
        if (moment(booking.startDate).isAfter(nextUpcomingTrip.startDate)) {
          nextUpcomingTrip = {
            startDate: moment(booking.startDate),
            tripId: t,
          }
        } else if (moment(booking.endDate).isBefore(mostRecentTrip.endDate)) {
          mostRecentTrip = {
            endDate: moment(booking.endDate),
            tripId: t,
          }
        }
      }

    })

    console.log('nextUpcomingTrip: ', nextUpcomingTrip)
    console.log('mostRecentTrip: ', mostRecentTrip)

    // Now return according to priority
    if (nextUpcomingTrip.tripId) {
      return nextUpcomingTrip.tripId
    } else if (mostRecentTrip.tripId) {
      return mostRecentTrip.tripId
    }

    return null

  }

  compileTrips = setActiveTrip => {

    const { courseBookings, homestayBookings } = this.props

    // Instantiate an empty object to fill
    const trips = {}

    // Start with homestay bookings
    homestayBookings.data.map(homestayBooking => trips[`h${homestayBooking.id}`] = {
      bookings: [Object.assign({}, homestayBooking, { bookingType: 'HOMESTAY' })],
    })

    // Now map through any potential course bookings
    courseBookings.data.map(courseBooking => {

      const data = Object.assign({}, courseBooking, { bookingType: 'COURSE' })

      // Determine a range for overlap checks
      const courseBookingRange = moment.range(courseBooking.startDate, courseBooking.endDate)

      // Instantiate a variable to keep track of overlapping
      let overlap = false

      // Loop through all existing trips
      Object.keys(trips).map(trip => {

        // Loop through all bookings in each trip
        trips[trip].bookings.map(booking => {

          // If a booking overlaps this courseBooking, push it into the trip
          if (booking.bookingType === 'HOMESTAY' &&
              moment.range(moment(booking.arrivalDate), moment(booking.departureDate)).overlaps(courseBookingRange) &&
              booking.status.indexOf('DECLINED') === -1 &&
              booking.status.indexOf('CANCELLED') === -1
            ) {
            trips[trip].bookings.push(data)
            overlap = true
          }

        })
      })

      // If there is no overlap with existing trips, create a new trip
      if (!overlap) {
        trips[`c${courseBooking.id}`] = {
          bookings: [data],
          status: courseBooking.status,
        }
      }

    })

    // Return compiled results
    this.setState({
      activeTripID: setActiveTrip ? this.determineActiveTrip(trips) : this.state.activeTripID,
      trips,
      initialised: true,
    })

  }

  render() {

    const { activeTripID, initialised, trips } = this.state
    const { courseBookings, homestayBookings, t } = this.props

    console.log(this)

    const activeTrip = activeTripID ? trips[activeTripID] : null
    const tripsLength = Object.keys(trips).length
    const noCourseBooking = activeTrip ? !activeTrip.bookings.some(booking => booking.bookingType === 'COURSE') : null
    const homestayIsCancelled = activeTrip && activeTrip.bookings[0] && activeTrip.bookings[0].bookingType === 'HOMESTAY' && (activeTrip.bookings[0].status.indexOf('DECLINED') > -1 || activeTrip.bookings[0].status.indexOf('CANCELLED') > -1)

    console.log('activeTrip: ', activeTrip)
    console.log(this)
    console.log(tripsLength)

    return (

      <div>
        <Helmet title={t('trips.title')} />
        <div className='container' style={styles.pageContainer}>
          <SpinLoader show={homestayBookings.loading || courseBookings.loading}>
            <div>
              {initialised && tripsLength > 0 && activeTrip &&
              <div>
                {activeTrip.bookings.map(booking => {
                  if (booking.bookingType === 'HOMESTAY') {
                    return <HomestayBooking booking={booking} key={booking.code} />
                  } else if (booking.bookingType === 'COURSE') {
                    return <CourseBooking booking={booking} key={booking.id} />
                  }
                })}
                {noCourseBooking && !homestayIsCancelled &&
                  <AddACourseBooking />
                }
                {tripsLength > 1 &&
                  <TripSelector
                    activeTripID={activeTripID}
                    trips={trips}
                    changeTrip={this.changeTrip}
                  />
                }
              </div>
            }
              {initialised && tripsLength === 0 &&
              <Row>
                <Col xs={12} md={6} mdOffset={3}>
                  <Panel style={styles.noTripsPanel}>
                    <h4 className='header-green'>{t('trips.no_trips')}</h4>
                    <div style={{ marginTop: 30 }}>
                      <Link to='/language-homestay/search'>
                        <Button bsSize='xsmall' bsStyle='primary'>{t('common.find_host')}</Button>
                      </Link>
                      <div style={{ margin: '0 10px', display: 'inline-block' }}>{t('common.words.or')}</div>
                      <Link to='language-course/search'>
                        <Button bsSize='xsmall' bsStyle='success'>{t('common.find_language_course')}</Button>
                      </Link>
                    </div>
                  </Panel>
                </Col>
              </Row>
            }
            </div>
          </SpinLoader>
        </div>
      </div>
    )
  }
}

Trips.propTypes = {
  dispatch: PropTypes.func,
  courseBookings: PropTypes.object,
  homestayBookings: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
