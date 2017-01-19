import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'

// Load reservations
const LOAD_RESERVATIONS = 'abroadwith/LOAD_RESERVATIONS'
const LOAD_RESERVATIONS_SUCCESS = 'abroadwith/LOAD_RESERVATIONS_SUCCESS'
const LOAD_RESERVATIONS_FAIL = 'abroadwith/LOAD_RESERVATIONS_FAIL'

export default function reducer(state = {}, action = {}) {
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
