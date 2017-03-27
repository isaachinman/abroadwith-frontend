import config from 'config'
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import superagent from 'superagent'
import { REHYDRATE } from 'redux-persist/constants'

// Create a potential homestay booking
const CREATE_POTENTIAL_COURSE_BOOKING = 'abroadwith/CREATE_POTENTIAL_COURSE_BOOKING'

// Update a potential homestay booking
const UPDATE_POTENTIAL_COURSE_BOOKING = 'abroadwith/UPDATE_POTENTIAL_COURSE_BOOKING'

// Delete a potential homestay booking
const DELETE_POTENTIAL_COURSE_BOOKING = 'abroadwith/DELETE_POTENTIAL_COURSE_BOOKING'

// Calculate course price
const CALCULATE_COURSE_PRICE_WITHIN_BOOKING = 'abroadwith/CALCULATE_COURSE_PRICE_WITHIN_BOOKING'
const CALCULATE_COURSE_PRICE_WITHIN_BOOKING_SUCCESS = 'abroadwith/CALCULATE_COURSE_PRICE_WITHIN_BOOKING_SUCCESS'
const CALCULATE_COURSE_PRICE_WITHIN_BOOKING_FAIL = 'abroadwith/CALCULATE_COURSE_PRICE_WITHIN_BOOKING_FAIL'

// Create course booking
const CREATE_COURSE_BOOKING = 'abroadwith/CREATE_COURSE_BOOKING'
const CREATE_COURSE_BOOKING_SUCCESS = 'abroadwith/CREATE_COURSE_BOOKING_SUCCESS'
const CREATE_COURSE_BOOKING_FAIL = 'abroadwith/CREATE_COURSE_BOOKING_FAIL'

// Cancel course booking
const CANCEL_COURSE_BOOKING = 'abroadwith/CANCEL_COURSE_BOOKING'
const CANCEL_COURSE_BOOKING_SUCCESS = 'abroadwith/CANCEL_COURSE_BOOKING_SUCCESS'
const CANCEL_COURSE_BOOKING_FAIL = 'abroadwith/CANCEL_COURSE_BOOKING_FAIL'

// Load homestay bookings
const LOAD_COURSE_BOOKINGS = 'abroadwith/LOAD_COURSE_BOOKINGS'
const LOAD_COURSE_BOOKINGS_SUCCESS = 'abroadwith/LOAD_COURSE_BOOKINGS_SUCCESS'
const LOAD_COURSE_BOOKINGS_FAIL = 'abroadwith/LOAD_COURSE_BOOKINGS_FAIL'

const initialState = {
  bookings: {
    loaded: false,
    loading: false,
  },
  loading: false,
  potentialBooking: {},
  potentialBookingHelpers: {
    price: {},
    upsellCourseBooking: {},
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // This is a rehydration (from localstore) case
    case REHYDRATE: {
      const incoming = action.payload.bookings
      if (incoming && incoming.courseBookings) {
        return Object.assign({}, state, {
          potentialBooking: incoming.courseBookings.potentialBooking,
          potentialBookingHelpers: incoming.courseBookings.potentialBookingHelpers,
        })
      }
      return state
    }
    case CANCEL_COURSE_BOOKING:
      return {
        ...state,
        bookings: Object.assign({}, state.bookings, {
          loading: true, // Loading will be set to false by refetch of bookings
        }),
      }
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
    case CREATE_POTENTIAL_COURSE_BOOKING:
      return {
        ...state,
        potentialBooking: action.potentialBookingObject,
        potentialBookingHelpers: Object.assign({}, action.potentialBookingHelpers, {
          price: {},
        }),
      }
    case UPDATE_POTENTIAL_COURSE_BOOKING:
      return {
        ...state,
        potentialBooking: Object.assign({}, state.potentialBooking, action.potentialBookingObject),
      }
    case DELETE_POTENTIAL_COURSE_BOOKING:
      return {
        ...state,
        potentialBooking: {},
        potentialBookingHelpers: {},
      }
    case CALCULATE_COURSE_PRICE_WITHIN_BOOKING:
      return {
        ...state,
        potentialBookingHelpers: Object.assign({}, state.potentialBookingHelpers, {
          price: {
            loading: true,
            loaded: false,
          },
        }),
      }
    case CALCULATE_COURSE_PRICE_WITHIN_BOOKING_SUCCESS:
      return {
        ...state,
        potentialBookingHelpers: Object.assign({}, state.potentialBookingHelpers, {
          price: {
            loading: false,
            loaded: true,
            data: action.result,
          },
        }),
      }
    case CALCULATE_COURSE_PRICE_WITHIN_BOOKING_FAIL:
      return {
        ...state,
        potentialBookingHelpers: Object.assign({}, state.potentialBookingHelpers, {
          price: {
            loading: false,
            loaded: false,
            error: action.error,
          },
        }),
      }
    case CREATE_COURSE_BOOKING:
      return {
        ...state,
        loading: true,
      }
    case CREATE_COURSE_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case CREATE_COURSE_BOOKING_FAIL:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

export function createPotentialCourseBooking(potentialBookingObject, potentialBookingHelpers) {
  return async dispatch => dispatch({ type: CREATE_POTENTIAL_COURSE_BOOKING, potentialBookingObject, potentialBookingHelpers })
}

export function updatePotentialCourseBooking(potentialBookingObject) {
  return async dispatch => dispatch({ type: UPDATE_POTENTIAL_COURSE_BOOKING, potentialBookingObject })
}

export function deletePotentialCourseBooking() {
  return async dispatch => dispatch({ type: DELETE_POTENTIAL_COURSE_BOOKING })
}


export function createCourseBooking(jwt, bookingObject, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: CREATE_COURSE_BOOKING })

    try {

      return new Promise((resolve, reject) => {

        const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/courseBookings`)
        request.set({ Authorization: `Bearer ${(jwt)}` })
        request.send(bookingObject)

        request.end((err, res) => {

          if (err) {

            reject(dispatch({ type: CREATE_COURSE_BOOKING_FAIL, err }))

          } else {

            // Request was successful
            resolve(dispatch({ type: CREATE_COURSE_BOOKING_SUCCESS, result: res }))
            cb()

          }

        })

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

export function cancelCourseBooking(jwt, bookingID) {

  return async dispatch => {

    dispatch({ type: CANCEL_COURSE_BOOKING })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/courseBookings/${bookingID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, res) => {

        if (err) {

          dispatch({ type: CANCEL_COURSE_BOOKING_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: CANCEL_COURSE_BOOKING_SUCCESS, result: res })
          dispatch(loadCourseBookings(jwt))

        }

      })

    } catch (err) {
      dispatch({ type: CANCEL_COURSE_BOOKING_FAIL, err })
    }
  }
}

export function calculateCoursePriceWithinBooking(params) {

  // Clean potential booking data for price calculation
  const cleanedData = Object.assign({}, params)
  delete cleanedData.level
  delete cleanedData.paymentMethodId
  delete cleanedData.studentName

  return async dispatch => {

    dispatch({ type: CALCULATE_COURSE_PRICE_WITHIN_BOOKING })

    try {

      // Validate request
      if (moment().isAfter(moment(params.arrivalDate)) || moment().isAfter(moment(params.departureDate))) {
        throw new Error('Date range is invalid')
      }

      const request = superagent.post(`${config.apiHost}/search/courses/id`)
      request.send(cleanedData)

      request.end((err, res) => {

        if (err) {

          dispatch({ type: CALCULATE_COURSE_PRICE_WITHIN_BOOKING_FAIL, err })

        } else {

          // Request was successful
          const response = JSON.parse(res.text)

          if (response.results && response.results.length > 0) {

            dispatch({ type: CALCULATE_COURSE_PRICE_WITHIN_BOOKING_SUCCESS, result: response.results[0].totalPrice })

          } else {

            dispatch({ type: CALCULATE_COURSE_PRICE_WITHIN_BOOKING_FAIL })

          }

        }

      })

    } catch (err) {
      dispatch({ type: CALCULATE_COURSE_PRICE_WITHIN_BOOKING_FAIL, err })
    }
  }

}
