import config from 'config'
import jwtDecode from 'jwt-decode'
import roundTo from 'round-to'
import superagent from 'superagent'
import { REHYDRATE } from 'redux-persist/constants'

// Create a potential homestay booking
const CREATE_POTENTIAL_HOMESTAY_BOOKING = 'abroadwith/CREATE_POTENTIAL_HOMESTAY_BOOKING'

// Update a potential homestay booking
const UPDATE_POTENTIAL_HOMESTAY_BOOKING = 'abroadwith/UPDATE_POTENTIAL_HOMESTAY_BOOKING'

// Delete a potential homestay booking
const DELETE_POTENTIAL_HOMESTAY_BOOKING = 'abroadwith/DELETE_POTENTIAL_HOMESTAY_BOOKING'

// Calculate homestay price
const CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING = 'abroadwith/CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING'
const CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_SUCCESS = 'abroadwith/CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_SUCCESS'
const CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_FAIL = 'abroadwith/CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_FAIL'

// Add upsell course booking
const ADD_UPSELL_COURSE_BOOKING = 'abroadwith/ADD_UPSELL_COURSE_BOOKING'

// Remove upsell course booking
const REMOVE_UPSELL_COURSE_BOOKING = 'abroadwith/REMOVE_UPSELL_COURSE_BOOKING'

// Create homestay booking
const CREATE_HOMESTAY_BOOKING = 'abroadwith/CREATE_HOMESTAY_BOOKING'
const CREATE_HOMESTAY_BOOKING_SUCCESS = 'abroadwith/CREATE_HOMESTAY_BOOKING_SUCCESS'
const CREATE_HOMESTAY_BOOKING_FAIL = 'abroadwith/CREATE_HOMESTAY_BOOKING_FAIL'

// Cancel homestay booking (guest)
const CANCEL_HOMESTAY_BOOKING = 'abroadwith/CANCEL_HOMESTAY_BOOKING'
const CANCEL_HOMESTAY_BOOKING_SUCCESS = 'abroadwith/CANCEL_HOMESTAY_BOOKING_SUCCESS'
const CANCEL_HOMESTAY_BOOKING_FAIL = 'abroadwith/CANCEL_HOMESTAY_BOOKING_FAIL'

// Load homestay bookings
const LOAD_HOMESTAY_BOOKINGS = 'abroadwith/LOAD_HOMESTAY_BOOKINGS'
const LOAD_HOMESTAY_BOOKINGS_SUCCESS = 'abroadwith/LOAD_HOMESTAY_BOOKINGS_SUCCESS'
const LOAD_HOMESTAY_BOOKINGS_FAIL = 'abroadwith/LOAD_HOMESTAY_BOOKINGS_FAIL'

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
      if (incoming && incoming.homestayBookings) {
        return Object.assign({}, state, {
          potentialBooking: incoming.homestayBookings.potentialBooking,
          potentialBookingHelpers: incoming.homestayBookings.potentialBookingHelpers,
        })
      }
      return state
    }
    case CREATE_POTENTIAL_HOMESTAY_BOOKING:
      return {
        ...state,
        potentialBooking: action.potentialBookingObject,
        potentialBookingHelpers: Object.assign({}, action.potentialBookingHelpers, {
          price: {},
          upsellCourseBooking: {},
        }),
      }
    case CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING:
      return {
        ...state,
        potentialBookingHelpers: Object.assign({}, state.potentialBookingHelpers, {
          price: {
            loading: true,
            loaded: false,
          },
        }),
      }
    case CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_SUCCESS:
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
    case CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_FAIL:
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
    case UPDATE_POTENTIAL_HOMESTAY_BOOKING:
      return {
        ...state,
        potentialBooking: Object.assign({}, state.potentialBooking, action.potentialBookingObject),
      }
    case ADD_UPSELL_COURSE_BOOKING:
      return {
        ...state,
        potentialBookingHelpers: Object.assign({}, state.potentialBookingHelpers, {
          upsellCourseBooking: action.courseBookingObject,
        }),
      }
    case REMOVE_UPSELL_COURSE_BOOKING:
      return {
        ...state,
        potentialBookingHelpers: Object.assign({}, state.potentialBookingHelpers, {
          upsellCourseBooking: {},
        }),
      }
    case DELETE_POTENTIAL_HOMESTAY_BOOKING:
      return {
        ...state,
        potentialBooking: {},
        potentialBookingHelpers: {},
      }
    case CREATE_HOMESTAY_BOOKING:
      return {
        ...state,
        loading: true,
      }
    case CREATE_HOMESTAY_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case CREATE_HOMESTAY_BOOKING_FAIL:
      return {
        ...state,
        loading: false,
      }
    case CANCEL_HOMESTAY_BOOKING:
      return {
        ...state,
        bookings: Object.assign({}, state.bookings, {
          loading: true, // Loading will be set to false by refetch of bookings
        }),
      }
    case LOAD_HOMESTAY_BOOKINGS:
      return {
        ...state,
        bookings: {
          loading: true,
          loaded: false,
        },
      }
    case LOAD_HOMESTAY_BOOKINGS_SUCCESS:
      return {
        ...state,
        bookings: {
          loading: false,
          loaded: true,
          data: action.result,
        },
      }
    case LOAD_HOMESTAY_BOOKINGS_FAIL:
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

export function createPotentialHomestayBooking(potentialBookingObject, potentialBookingHelpers) {
  return async dispatch => dispatch({ type: CREATE_POTENTIAL_HOMESTAY_BOOKING, potentialBookingObject, potentialBookingHelpers })
}

export function updatePotentialHomestayBooking(potentialBookingObject) {
  return async dispatch => dispatch({ type: UPDATE_POTENTIAL_HOMESTAY_BOOKING, potentialBookingObject })
}

export function addUpsellCourseBooking(courseBookingObject) {
  return async dispatch => dispatch({ type: ADD_UPSELL_COURSE_BOOKING, courseBookingObject })
}

export function removeUpsellCourseBooking() {
  return async dispatch => dispatch({ type: REMOVE_UPSELL_COURSE_BOOKING })
}

export function deletePotentialHomestayBooking() {
  return async dispatch => dispatch({ type: DELETE_POTENTIAL_HOMESTAY_BOOKING })
}

export function calculateHomestayPriceWithinBooking(jwt, params) {

  // Clean the data
  const cleanedParams = Object.assign({}, params)
  delete cleanedParams.paymentMethodId

  return async dispatch => {

    dispatch({ type: CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/bookings/price`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(cleanedParams)

      request.end((err, res) => {

        if (err) {

          dispatch({ type: CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_SUCCESS, result: roundTo(JSON.parse(res.text), 2) })

        }

      })

    } catch (err) {
      dispatch({ type: CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_FAIL, err })
    }
  }

}

export function createHomestayBooking(jwt, bookingObject, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: CREATE_HOMESTAY_BOOKING })

    try {

      return new Promise((resolve) => {

        const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/bookings`)
        request.set({ Authorization: `Bearer ${(jwt)}` })
        request.send(bookingObject)

        request.end((err, res) => {

          if (err) {

            resolve(dispatch({ type: CREATE_HOMESTAY_BOOKING_FAIL, err }))

          } else {

            // Request was successful
            resolve(dispatch({ type: CREATE_HOMESTAY_BOOKING_SUCCESS, result: res }))
            cb()

          }

        })

      })

    } catch (err) {
      dispatch({ type: CREATE_HOMESTAY_BOOKING_FAIL, err })
    }
  }

}

export function loadHomestayBookings(jwt) {
  return {
    types: [LOAD_HOMESTAY_BOOKINGS, LOAD_HOMESTAY_BOOKINGS_SUCCESS, LOAD_HOMESTAY_BOOKINGS_FAIL],
    promise: client => client.get(`users/${jwtDecode(jwt).rid}/bookings`, { auth: jwt }),
  }
}

export function cancelHomestayBooking(jwt, bookingID) {

  return async dispatch => {

    dispatch({ type: CANCEL_HOMESTAY_BOOKING })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/bookings/${bookingID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, res) => {

        if (err) {

          dispatch({ type: CANCEL_HOMESTAY_BOOKING_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: CANCEL_HOMESTAY_BOOKING_SUCCESS, result: res })
          dispatch(loadHomestayBookings(jwt))

        }

      })

    } catch (err) {
      dispatch({ type: CANCEL_HOMESTAY_BOOKING_FAIL, err })
    }
  }
}
