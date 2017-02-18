import config from 'config'
import jwtDecode from 'jwt-decode'
import superagent from 'superagent'

// Create course booking
const CREATE_COURSE_BOOKING = 'abroadwith/CREATE_COURSE_BOOKING'
const CREATE_COURSE_BOOKING_SUCCESS = 'abroadwith/CREATE_COURSE_BOOKING_SUCCESS'
const CREATE_COURSE_BOOKING_FAIL = 'abroadwith/CREATE_COURSE_BOOKING_FAIL'

export function createCourseBooking(jwt, bookingObject, callback) { // eslint-disable-line

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: CREATE_COURSE_BOOKING })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/bookings`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(bookingObject)

      request.end((err, res) => {

        if (err) {

          dispatch({ type: CREATE_COURSE_BOOKING_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: CREATE_COURSE_BOOKING_SUCCESS, result: res })
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: CREATE_COURSE_BOOKING_FAIL, err })
    }
  }

}
