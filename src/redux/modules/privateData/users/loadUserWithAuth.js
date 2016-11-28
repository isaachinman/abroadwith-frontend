const LOAD_USER_WITH_AUTH = 'abroadwith/LOAD_USER_WITH_AUTH'
const LOAD_USER_WITH_AUTH_SUCCESS = 'abroadwith/LOAD_USER_WITH_AUTH_SUCCESS'
const LOAD_USER_WITH_AUTH_FAIL = 'abroadwith/LOAD_USER_WITH_AUTH_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_USER_WITH_AUTH:
      return {
        ...state,
        loading: true,
      }
    case LOAD_USER_WITH_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
      }
    case LOAD_USER_WITH_AUTH_FAIL:
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

export function isLoaded(globalState, userID) {
  return globalState.publicData.users[userID]
}

export function load(userID) {
  return {
    types: [LOAD_USER_WITH_AUTH, LOAD_USER_WITH_AUTH_SUCCESS, LOAD_USER_WITH_AUTH_FAIL],
    promise: client => client.get(`users/${userID}`, true),
  }
}
