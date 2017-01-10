import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'

const LOAD_HOMESTAY_WITH_AUTH = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH'
const LOAD_HOMESTAY_WITH_AUTH_SUCCESS = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH_SUCCESS'
const LOAD_HOMESTAY_WITH_AUTH_FAIL = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH_FAIL'

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case LOAD_HOMESTAY_WITH_AUTH:
      return {
        ...state,
        [action.homeID]: {
          loading: true,
          loaded: false,
        },
      }
    case LOAD_HOMESTAY_WITH_AUTH_SUCCESS:
      return {
        ...state,
        [action.homeID]: {
          loading: false,
          loaded: true,
          data: action.result,
        },
      }
    case LOAD_HOMESTAY_WITH_AUTH_FAIL:
      return {
        ...state,
        [action.homeID]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      }
    default:
      return state
  }
}

export function isLoaded(globalState) {
  return globalState.publicData.homestays && globalState.publicData.homestays.loaded
}

export function load(jwt, homeID) {

  return async dispatch => {

    dispatch({ type: LOAD_HOMESTAY_WITH_AUTH, homeID })

    try {

      const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: LOAD_HOMESTAY_WITH_AUTH_FAIL, homeID, err })

        } else {

          // Login was successful
          dispatch({ type: LOAD_HOMESTAY_WITH_AUTH_SUCCESS, homeID, result: body })

        }

      })

    } catch (err) {
      dispatch({ type: LOAD_HOMESTAY_WITH_AUTH_FAIL, homeID, err })
    }
  }
}
