const LOAD_EDUCATOR = 'abroadwith/LOAD'
const LOAD_EDUCATOR_SUCCESS = 'abroadwith/LOAD_SUCCESS'
const LOAD_EDUCATOR_FAIL = 'abroadwith/LOAD_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_EDUCATOR:
      return {
        ...state,
        loading: true,
      }
    case LOAD_EDUCATOR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        [action.result.id]: action.result,
      }
    case LOAD_EDUCATOR_FAIL:
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

export function isLoaded(globalState, educatorID) {
  return globalState.publicData.educators[educatorID]
}

export function load(educatorID) {
  console.log('inside load educator', educatorID)
  return {
    types: [LOAD_EDUCATOR, LOAD_EDUCATOR_SUCCESS, LOAD_EDUCATOR_FAIL],
    promise: client => client.get(`/public/educators/${educatorID}`),
  }
}
