// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { Col, Panel, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { extendMoment } from 'moment-range'
import Helmet from 'react-helmet'
import { load as loadHomestay } from 'redux/modules/publicData/homes/loadHome'
import { loadCourseBookings } from 'redux/modules/privateData/bookings/courseBookings'
import { loadHomestayBookings } from 'redux/modules/privateData/bookings/homestayBookings'
import Moment from 'moment'
import Radium from 'radium'
import { translate } from 'react-i18next'
import shortid from 'shortid'

// Relative imports
import CourseBooking from './subcomponents/CourseBooking'
import HomestayBooking from './subcomponents/HomestayBooking'
import styles from './Trips.styles'

// Extend moment
const moment = extendMoment(Moment)

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {

    const promises = []

    const token = getState().auth.token

    promises.push(dispatch(loadHomestayBookings(token)).then(data => {
      if (data[0] && data[0].homeId) {
        dispatch(loadHomestay(data[0].homeId))
      }
    }))

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

  componentWillMount = () => {

    // This is a rather complex initialisation step that compiles
    // homestay bookings and course bookings into "Trips"
    this.compileTrips(true)

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

      if (booking.type === 'HOMESTAY') {
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
      } else if (booking.type === 'COURSE') {
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

  }

  compileTrips = setActiveTrip => {

    const { courseBookings, homestayBookings } = this.props

    // Instantiate an empty object to fill
    const trips = {}

    // Start with homestay bookings, assign an ID and status
    homestayBookings.data.map(homestayBooking => trips[shortid()] = {
      bookings: [Object.assign({}, homestayBooking, { type: 'HOMESTAY' })],
      status: homestayBooking.status,
    })

    // Now map through any potential course bookings
    courseBookings.data.map(courseBooking => {

      // Determine a range for overlap checks
      const courseBookingRange = moment.range(courseBooking.startDate, courseBooking.endDate)

      // Instantiate a variable to keep track of overlapping
      let overlap = false

      // Loop through all existing trips
      Object.keys(trips).map(trip => {

        // Loop through all bookings in each trip
        trips[trip].bookings.map(booking => {

          // If a booking overlaps this courseBooking, push it into the trip
          if (booking.type === 'HOMESTAY' &&
              moment.range(moment(booking.arrivalDate), moment(booking.departureDate)).overlaps(courseBookingRange) &&
              booking.status.indexOf('DECLINED') === -1 &&
              booking.status.indexOf('CANCELLED') === -1
            ) {
            trips[trip].bookings.push(courseBooking)
            overlap = true
          }

        })
      })

      // If there is no overlap with existing trips, create a new trip
      if (!overlap) {
        trips[shortid()] = {
          bookings: [Object.assign({}, courseBooking, { type: 'COURSE' })],
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
    const { t } = this.props

    const activeTrip = trips[activeTripID]
    const tripsLength = Object.keys(trips).length
    console.log('activeTrip: ', activeTrip)
    console.log(this)
    console.log(tripsLength)

    return (

      <div>
        <Helmet title={t('trips.title')} />
        <div className='container' style={styles.pageContainer}>
          <div>
            {initialised && tripsLength > 0 &&
              <div>
                {activeTrip.bookings.map(booking => {
                  if (booking.type === 'HOMESTAY') {
                    return <HomestayBooking booking={booking} key={booking.code} />
                  } else if (booking.type === 'COURSE') {
                    return <CourseBooking booking={booking} key={booking.id} />
                  }
                })}
              </div>
            }
            {initialised && tripsLength === 0 &&
            <Row>
              <Col xs={12} md={6} mdOffset={3}>
                <Panel style={styles.noTripsPanel}>
                  <h4 className='header-green'>{t('trips.no_trips')}</h4>
                </Panel>
              </Col>
            </Row>
            }
          </div>
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

/*

Trips methodoloy:
1. asyncConnect all homestay bookings
2. asyncConnect all course bookings
3. Run loader while compilation happens
4. Push all homestay bookings into an array
5. Loop through course bookings, if any overlap with any homestay bookings, push them into the same object
6. Left with an array of "Trips", which can have 0 to 1 hometay booking, and 0 to multiple course bookings


Data should look like:

const trips = [
  [
    {
      type: trip
    },
    {
      type: course
    }
  ]
]

*/
