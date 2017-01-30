import superagent from 'superagent'

// Perform search
const PERFORM_ROOM_SEARCH = 'abroadwith/PERFORM_ROOM_SEARCH'
const PERFORM_ROOM_SEARCH_SUCCESS = 'abroadwith/PERFORM_ROOM_SEARCH_SUCCESS'
const PERFORM_ROOM_SEARCH_FAIL = 'abroadwith/PERFORM_ROOM_SEARCH_FAIL'

// Update search params
const UPDATE_ROOM_SEARCH_PARAMS = 'abroadwith/UPDATE_ROOM_SEARCH_PARAMS'

const initialState = {
  loaded: false,
  loading: false,
  params: {
    arrival: null,
    departure: null,
    mapData: {},
  },
  data: {
    results: [],
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_ROOM_SEARCH_PARAMS:
      return {
        ...state,
        params: action.params,
      }
    case PERFORM_ROOM_SEARCH:
      return {
        ...state,
        loading: true,
      }
    case PERFORM_ROOM_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
      }
    case PERFORM_ROOM_SEARCH_FAIL:
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

export function performRoomSearch(url) {

  return async dispatch => {

    dispatch({ type: PERFORM_ROOM_SEARCH })

    try {

      const request = superagent.get(url)
      request.end((err, res = {}) => {

        if (err) {

          dispatch({ type: PERFORM_ROOM_SEARCH_FAIL, err })

        } else {

          // GET was successful
          dispatch({ type: PERFORM_ROOM_SEARCH_SUCCESS, result: JSON.parse(res.text) })

        }

      })

    } catch (err) {
      dispatch({ type: PERFORM_ROOM_SEARCH_FAIL, err })
    }
  }
}

export function updateRoomSearchParams(params, refetch) {
  return async dispatch => {

    dispatch({ type: UPDATE_ROOM_SEARCH_PARAMS, params })

    if (refetch) {
      performRoomSearch(params)
    }

  }
}
