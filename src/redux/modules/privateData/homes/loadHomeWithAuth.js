import jwtDecode from 'jwt-decode'

const LOAD_HOMESTAY_WITH_AUTH = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH'
const LOAD_HOMESTAY_WITH_AUTH_SUCCESS = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH_SUCCESS'
const LOAD_HOMESTAY_WITH_AUTH_FAIL = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_HOMESTAY_WITH_AUTH:
      return {
        ...state,
        loading: true,
      }
    case LOAD_HOMESTAY_WITH_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
      }
    case LOAD_HOMESTAY_WITH_AUTH_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      }
    default:
      return state
  }
}

export function isLoaded(globalState) {
  return globalState.publicData.homestays && globalState.publicData.homestays.loaded
}

export function load(jwt) {
  return {
    types: [LOAD_HOMESTAY_WITH_AUTH, LOAD_HOMESTAY_WITH_AUTH_SUCCESS, LOAD_HOMESTAY_WITH_AUTH_FAIL],
    promise: client => client.get(`/users/${jwtDecode(jwt).rid}/homes/${jwtDecode(jwt).hid}`, { auth: jwt }),
  }
}
