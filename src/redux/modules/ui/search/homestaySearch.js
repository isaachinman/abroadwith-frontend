import config from 'config'
import superagent from 'superagent'
import homestaySearchParamsToUrl from 'utils/search/homestaySearchParamsToUrl'
import moment from 'moment'
import { REHYDRATE } from 'redux-persist/constants'
import { roundTo } from 'utils/numbers'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

// Perform search
const PERFORM_ROOM_SEARCH = 'abroadwith/PERFORM_ROOM_SEARCH'
const PERFORM_ROOM_SEARCH_SUCCESS = 'abroadwith/PERFORM_ROOM_SEARCH_SUCCESS'
const PERFORM_ROOM_SEARCH_FAIL = 'abroadwith/PERFORM_ROOM_SEARCH_FAIL'

// Calculate homestay price
const CALCULATE_HOMESTAY_PRICE = 'abroadwith/CALCULATE_HOMESTAY_PRICE'
const CALCULATE_HOMESTAY_PRICE_SUCCESS = 'abroadwith/CALCULATE_HOMESTAY_PRICE_SUCCESS'
const CALCULATE_HOMESTAY_PRICE_FAIL = 'abroadwith/CALCULATE_HOMESTAY_PRICE_FAIL'

// Update search params
const UPDATE_ROOM_SEARCH_PARAMS = 'abroadwith/UPDATE_ROOM_SEARCH_PARAMS'

// Update activeRoom
const UPDATE_ACTIVE_ROOM = 'abroadwith/UPDATE_ACTIVE_ROOM'

// Erase history
const ERASE_HOMESTAY_SEARCH_HISTORY = 'abroadwith/ERASE_HOMESTAY_SEARCH_HISTORY'

const initialState = {
  activeRoom: null,
  loaded: false,
  loading: false,
  rehydrate: true,
  params: {
    arrival: null,
    departure: null,
    guests: 1,
    homeType: null,
    immersions: {
      stay: true,
      tandem: true,
      teacher: true,
    },
    language: null,
    tandemLanguage: null,
    mapData: {},
    minPrice: 0,
    maxPrice: 600,
    filters: [],
    pageOffset: 0,
    pageSize: 10,
  },
  price: {
    loading: false,
    loaded: false,
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
      if (incoming && incoming.homestaySearch && incoming.homestaySearch.rehydrate) {
        return Object.assign({}, state, incoming.homestaySearch, {

          // Do not rehydrate these things
          activeRoom: null,
          loaded: false,
          loading: false,
          price: {
            loading: false,
            loaded: false,
          },

        })
      }
      return state
    }
    // Used to erase history when it (because of rehydration),
    // would cause weird behaviour
    case ERASE_HOMESTAY_SEARCH_HISTORY: {
      return Object.assign({}, initialState, { rehydrate: false })
    }
    case UPDATE_ROOM_SEARCH_PARAMS:
      return {
        ...state,
        params: Object.assign({}, state.params, action.params),
      }
    case UPDATE_ACTIVE_ROOM:
      return {
        ...state,
        activeRoom: action.roomID,
      }
    case CALCULATE_HOMESTAY_PRICE:
      return {
        ...state,
        price: {
          loading: true,
        },
      }
    case CALCULATE_HOMESTAY_PRICE_SUCCESS:
      return {
        ...state,
        price: {
          loading: false,
          loaded: true,
          data: action.result,
        },
      }
    case CALCULATE_HOMESTAY_PRICE_FAIL:
      return {
        ...state,
        price: {
          loading: false,
          loaded: false,
          error: action.error,
        },
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

export function eraseHomestaySearchHistory() {
  return async dispatch => dispatch({ type: ERASE_HOMESTAY_SEARCH_HISTORY })
}

export function updateRoomSearchParams(params) {
  return async dispatch => dispatch({ type: UPDATE_ROOM_SEARCH_PARAMS, params })
}

export function updateActiveRoom(roomID) {
  return async dispatch => dispatch({ type: UPDATE_ACTIVE_ROOM, roomID })
}

export function performRoomSearch(params, push) {

  return async dispatch => {

    dispatch(showLoading())
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
          dispatch(hideLoading())

        } else {

          // GET was successful
          dispatch({ type: PERFORM_ROOM_SEARCH_SUCCESS, result: JSON.parse(res.text) })
          dispatch(hideLoading())

          // By dispatching the push after results are already loaded, users will hit
          // the search page with results already populated
          if (typeof push === 'function') {
            dispatch(push(`/language-homestay/search${query}`))
          }

        }

      })

    } catch (err) {
      dispatch({ type: PERFORM_ROOM_SEARCH_FAIL, err })
      dispatch(hideLoading())
    }
  }
}

export function calculateHomestayPrice(params) {

  return async dispatch => {

    dispatch({ type: CALCULATE_HOMESTAY_PRICE })

    try {

      // Validate request
      if (moment().isAfter(moment(params.arrivalDate)) || moment().isAfter(moment(params.departureDate))) {
        throw new Error('Date range is invalid')
      }

      const request = superagent.post(`${config.apiHost}/public/bookings/price`)
      request.send(params)

      request.end((err, res) => {

        if (err) {

          dispatch({ type: CALCULATE_HOMESTAY_PRICE_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: CALCULATE_HOMESTAY_PRICE_SUCCESS, result: (roundTo(JSON.parse(res.text), 2)).toFixed(2) })

        }

      })

    } catch (err) {
      dispatch({ type: CALCULATE_HOMESTAY_PRICE_FAIL, err })
    }
  }

}
