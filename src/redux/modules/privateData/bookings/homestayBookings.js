import { REHYDRATE } from 'redux-persist/constants'

// Create a potential homestay booking
const CREATE_POTENTIAL_HOMESTAY_BOOKING = 'abroadwith/CREATE_POTENTIAL_HOMESTAY_BOOKING'

const initialState = {
  potentialBooking: {},
  potentialBookingHelpers: {},
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // This is a rehydration (from localstore) case
    case REHYDRATE: {
      const incoming = action.payload.uiPersist
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
        potentialBookingHelpers: action.potentialBookingHelpers,
      }
    default:
      return state
  }
}

export function createPotentialHomestayBooking(potentialBookingObject, potentialBookingHelpers) {
  return async dispatch => dispatch({ type: CREATE_POTENTIAL_HOMESTAY_BOOKING, potentialBookingObject, potentialBookingHelpers })
}
