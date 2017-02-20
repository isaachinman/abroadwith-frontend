import config from 'config'
import jwtDecode from 'jwt-decode'
import superagent from 'superagent'

// Create course booking
const CREATE_COURSE_BOOKING = 'abroadwith/CREATE_COURSE_BOOKING'
const CREATE_COURSE_BOOKING_SUCCESS = 'abroadwith/CREATE_COURSE_BOOKING_SUCCESS'
const CREATE_COURSE_BOOKING_FAIL = 'abroadwith/CREATE_COURSE_BOOKING_FAIL'

// Load homestay bookings
const LOAD_COURSE_BOOKINGS = 'abroadwith/LOAD_COURSE_BOOKINGS'
const LOAD_COURSE_BOOKINGS_SUCCESS = 'abroadwith/LOAD_COURSE_BOOKINGS_SUCCESS'
const LOAD_COURSE_BOOKINGS_FAIL = 'abroadwith/LOAD_COURSE_BOOKINGS_FAIL'

const initialState = {
  bookings: {
    loaded: false,
    loading: false,
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_COURSE_BOOKINGS:
      return {
        ...state,
        bookings: {
          loading: true,
          loaded: false,
        },
      }
    case LOAD_COURSE_BOOKINGS_SUCCESS:
      return {
        ...state,
        bookings: {
          loading: false,
          loaded: true,
          data: action.result,
        },
      }
    case LOAD_COURSE_BOOKINGS_FAIL:
      return {
        ...state,
        bookings: {
          loading: false,
          loaded: false,
          error: true,
          errorMessage: action.error,
        },
      }
    default:
      return state
  }
}

export function createCourseBooking(jwt, bookingObject, callback) {

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

export function loadCourseBookings(jwt) {
  return {
    types: [LOAD_COURSE_BOOKINGS, LOAD_COURSE_BOOKINGS_SUCCESS, LOAD_COURSE_BOOKINGS_FAIL],
    promise: client => client.get(`users/${jwtDecode(jwt).rid}/courseBookings`, { auth: jwt }),
  }
}
