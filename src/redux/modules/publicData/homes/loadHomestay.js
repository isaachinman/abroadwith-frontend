const LOAD_HOMESTAY = 'abroadwith/LOAD'
const LOAD_HOMESTAY_SUCCESS = 'abroadwith/LOAD_SUCCESS'
const LOAD_HOMESTAY_FAIL = 'abroadwith/LOAD_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_HOMESTAY:
      return {
        ...state,
        loading: true,
      }
    case LOAD_HOMESTAY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        [action.result.id]: action.result,
      }
    case LOAD_HOMESTAY_FAIL:
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

export function isLoaded(globalState, homeID) {
  return globalState.publicData.homestays[homeID]
}

export function load(homeID) {
  return {
    types: [LOAD_HOMESTAY, LOAD_HOMESTAY_SUCCESS, LOAD_HOMESTAY_FAIL],
    promise: client => client.get(`/public/homes/${homeID}`),
  }
}
