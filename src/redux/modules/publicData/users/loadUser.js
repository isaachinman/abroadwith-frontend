const LOAD_USER = 'abroadwith/LOAD_USER'
const LOAD_USER_SUCCESS = 'abroadwith/LOAD_USER_SUCCESS'
const LOAD_USER_FAIL = 'abroadwith/LOAD_USER_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_USER:
      return {
        ...state,
        loading: true,
      }
    case LOAD_USER_SUCCESS:
      console.log(action)
      return {
        ...state,
        loading: false,
        loaded: true,
        [action.result.id]: action.result,
      }
    case LOAD_USER_FAIL:
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
  return globalState.publicData.homestays[userID]
}

export function load(userID) {
  return {
    types: [LOAD_USER, LOAD_USER_SUCCESS, LOAD_USER_FAIL],
    promise: (client) => client.get(`/public/users/${userID}`),
  }
}
