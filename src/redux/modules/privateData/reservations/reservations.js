import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'

// Load reservations
const LOAD_RESERVATIONS = 'abroadwith/LOAD_RESERVATIONS'
const LOAD_RESERVATIONS_SUCCESS = 'abroadwith/LOAD_RESERVATIONS_SUCCESS'
const LOAD_RESERVATIONS_FAIL = 'abroadwith/LOAD_RESERVATIONS_FAIL'

// Approve reservation
const APPROVE_RESERVATION = 'abroadwith/APPROVE_RESERVATION'
const APPROVE_RESERVATION_SUCCESS = 'abroadwith/APPROVE_RESERVATION_SUCCESS'
const APPROVE_RESERVATION_FAIL = 'abroadwith/APPROVE_RESERVATION_FAIL'

// Decline reservation
const CANCEL_RESERVATION = 'abroadwith/CANCEL_RESERVATION'
const CANCEL_RESERVATION_SUCCESS = 'abroadwith/CANCEL_RESERVATION_SUCCESS'
const CANCEL_RESERVATION_FAIL = 'abroadwith/CANCEL_RESERVATION_FAIL'

// Decline reservation
const DECLINE_RESERVATION = 'abroadwith/DECLINE_RESERVATION'
const DECLINE_RESERVATION_SUCCESS = 'abroadwith/DECLINE_RESERVATION_SUCCESS'
const DECLINE_RESERVATION_FAIL = 'abroadwith/DECLINE_RESERVATION_FAIL'

const initialState = {
  loading: false,
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_RESERVATIONS:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
      })
    case LOAD_RESERVATIONS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        data: action.result,
      })
    case LOAD_RESERVATIONS_FAIL:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
      })
    case APPROVE_RESERVATION:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
      })
    case APPROVE_RESERVATION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
      })
    case APPROVE_RESERVATION_FAIL:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
      })
    case CANCEL_RESERVATION:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
      })
    case CANCEL_RESERVATION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
      })
    case CANCEL_RESERVATION_FAIL:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
      })
    case DECLINE_RESERVATION:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
      })
    case DECLINE_RESERVATION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
      })
    case DECLINE_RESERVATION_FAIL:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
      })
    default:
      return state
  }
}

export function loadReservations(jwt) {

  return async dispatch => {

    dispatch({ type: LOAD_RESERVATIONS })

    try {

      const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/reservations`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: LOAD_RESERVATIONS_FAIL, err })

        } else {

          // Login was successful
          dispatch({ type: LOAD_RESERVATIONS_SUCCESS, result: body })

        }

      })

    } catch (err) {
      dispatch({ type: LOAD_RESERVATIONS_FAIL, err })
    }
  }
}

export function approveReservation(jwt, reservationID, refetchReservations) {

  return async dispatch => {

    dispatch({ type: APPROVE_RESERVATION })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/reservations/${reservationID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send({
        reservationStatusRequest: 'APPROVED',
      })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: APPROVE_RESERVATION_FAIL, err })

        } else {

          // Approval was successful
          dispatch({ type: APPROVE_RESERVATION_SUCCESS, result: body })

          // Refetch if desired
          if (refetchReservations) {
            dispatch(loadReservations(jwt))
          }

        }

      })

    } catch (err) {
      dispatch({ type: APPROVE_RESERVATION_FAIL, err })
    }
  }
}

export function cancelReservation(jwt, reservationID, refetchReservations) {

  return async dispatch => {

    dispatch({ type: CANCEL_RESERVATION })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/reservations/${reservationID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send({
        reservationStatusRequest: 'CANCELLED',
      })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: CANCEL_RESERVATION_FAIL, err })

        } else {

          // Decline was successful
          dispatch({ type: CANCEL_RESERVATION_SUCCESS, result: body })

          // Refetch if desired
          if (refetchReservations) {
            dispatch(loadReservations(jwt))
          }

        }

      })

    } catch (err) {
      dispatch({ type: CANCEL_RESERVATION_FAIL, err })
    }
  }
}

export function declineReservation(jwt, reservationID, refetchReservations) {

  return async dispatch => {

    dispatch({ type: DECLINE_RESERVATION })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/reservations/${reservationID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send({
        reservationStatusRequest: 'CANCELLED',
      })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: DECLINE_RESERVATION_FAIL, err })

        } else {

          // Decline was successful
          dispatch({ type: DECLINE_RESERVATION_SUCCESS, result: body })

          // Refetch if desired
          if (refetchReservations) {
            dispatch(loadReservations(jwt))
          }

        }

      })

    } catch (err) {
      dispatch({ type: DECLINE_RESERVATION_FAIL, err })
    }
  }
}
