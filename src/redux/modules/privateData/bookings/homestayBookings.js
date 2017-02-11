import { REHYDRATE } from 'redux-persist/constants'

// Create a potential homestay booking
const CREATE_POTENTIAL_HOMESTAY_BOOKING = 'abroadwith/CREATE_POTENTIAL_HOMESTAY_BOOKING'

const initialState = {
  potentialBooking: {},
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // This is a rehydration (from localstore) case
    case REHYDRATE: {
      const incoming = action.payload.uiPersist
      if (incoming && incoming.homestayBookings) {
        return Object.assign({}, state, {
          potentialBooking: incoming.homestayBookings.potentialBooking,
        })
      }
      return state
    }
    case CREATE_POTENTIAL_HOMESTAY_BOOKING:
      return {
        ...state,
        potentialBooking: action.potentialBookingObject,
      }
    default:
      return state
  }
}

export function createPotentialHomestayBooking(potentialBookingObject) {
  return async dispatch => dispatch({ type: CREATE_POTENTIAL_HOMESTAY_BOOKING, potentialBookingObject })
}
