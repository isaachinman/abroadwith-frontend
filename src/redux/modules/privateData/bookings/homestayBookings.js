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

const initialState = {
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
    case DELETE_POTENTIAL_HOMESTAY_BOOKING:
      return {
        ...state,
        potentialBooking: {},
        potentialBookingHelpers: {},
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
          dispatch({ type: CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_SUCCESS, result: (roundTo(JSON.parse(res.text), 2)).toFixed(2) })

        }

      })

    } catch (err) {
      dispatch({ type: CALCULATE_HOMESTAY_PRICE_WITHIN_BOOKING_FAIL, err })
    }
  }

}
