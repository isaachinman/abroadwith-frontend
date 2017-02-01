import superagent from 'superagent'
import homestaySearchParamsToUrl from 'utils/search/homestaySearchParamsToUrl'
import { REHYDRATE } from 'redux-persist/constants'

// Define homestay map size
const DEFINE_HOMESTAY_MAP_SIZE = 'abroadwith/DEFINE_HOMESTAY_MAP_SIZE'

// Perform search
const PERFORM_ROOM_SEARCH = 'abroadwith/PERFORM_ROOM_SEARCH'
const PERFORM_ROOM_SEARCH_SUCCESS = 'abroadwith/PERFORM_ROOM_SEARCH_SUCCESS'
const PERFORM_ROOM_SEARCH_FAIL = 'abroadwith/PERFORM_ROOM_SEARCH_FAIL'

// Update search params
const UPDATE_ROOM_SEARCH_PARAMS = 'abroadwith/UPDATE_ROOM_SEARCH_PARAMS'

const initialState = {
  loaded: false,
  loading: false,
  mapDimensions: {},
  params: {
    arrival: null,
    departure: null,
    guests: 1,
    mapData: {},
  },
  data: {
    results: [],
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // This is a rehydration (from localstore) case
    case REHYDRATE: {
      const incoming = action.payload.uiPersist
      if (incoming) return Object.assign({}, state, incoming.homestaySearch)
      return state
    }
    case DEFINE_HOMESTAY_MAP_SIZE:
      return {
        ...state,
        mapDimensions: action.dimensions,
      }
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

export function updateRoomSearchParams(params) {
  return async dispatch => dispatch({ type: UPDATE_ROOM_SEARCH_PARAMS, params })
}

export function defineHomestayMapSize(dimensions) {
  return async dispatch => dispatch({ type: DEFINE_HOMESTAY_MAP_SIZE, dimensions })
}

export function performRoomSearch(params, push) {

  return async dispatch => {

    dispatch({ type: PERFORM_ROOM_SEARCH })

    // It's important to dispatch param update _after_ search.loading has been set
    // to prevent the map from calling another search on bounds change
    dispatch(updateRoomSearchParams(params))

    try {

      const query = homestaySearchParamsToUrl(Object.assign({}, params))

      const request = superagent.get(`/homestays/search/get-results${query}`)
      request.end((err, res = {}) => {

        if (err) {

          dispatch({ type: PERFORM_ROOM_SEARCH_FAIL, err })

        } else {

          // GET was successful
          dispatch({ type: PERFORM_ROOM_SEARCH_SUCCESS, result: JSON.parse(res.text) })

          // By dispatching the push after results are already loaded, users will hit
          // the search page with results already populated
          if (typeof push === 'function') {
            dispatch(push(`/language-homestay/search${query}`))
          }

        }

      })

    } catch (err) {
      dispatch({ type: PERFORM_ROOM_SEARCH_FAIL, err })
    }
  }
}
