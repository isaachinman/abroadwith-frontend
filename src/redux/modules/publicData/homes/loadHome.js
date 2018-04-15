import config from 'config'
import superagent from 'superagent'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

// Load public homestay
const LOAD_HOMESTAY = 'abroadwith/LOAD_HOMESTAY'
const LOAD_HOMESTAY_SUCCESS = 'abroadwith/LOAD_HOMESTAY_SUCCESS'
const LOAD_HOMESTAY_FAIL = 'abroadwith/LOAD_HOMESTAY_FAIL'

// Load room calendar
const LOAD_ROOM_CALENDAR = 'abroadwith/LOAD_ROOM_CALENDAR'
const LOAD_ROOM_CALENDAR_SUCCESS = 'abroadwith/LOAD_ROOM_CALENDAR_SUCCESS'
const LOAD_ROOM_CALENDAR_FAIL = 'abroadwith/LOAD_ROOM_CALENDAR_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_HOMESTAY:
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          loading: true,
          roomCalendars: {
            loading: false,
          },
        }),
      }
    case LOAD_HOMESTAY_SUCCESS:
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          loading: false,
          loaded: true,
          data: action.result,
        }),
      }
    case LOAD_HOMESTAY_FAIL:
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          loading: false,
          loaded: false,
          error: action.error,
        }),
      }
    case LOAD_ROOM_CALENDAR:
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          roomCalendars: Object.assign({}, state[action.homeID].roomCalendars, {
            loading: true,
            [action.roomID]: Object.assign({}, state[action.homeID].roomCalendars[action.roomID]),
          }),
        }),
      }
    case LOAD_ROOM_CALENDAR_SUCCESS:
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          roomCalendars: Object.assign({}, state[action.homeID].roomCalendars, {
            loading: false,
            [action.roomID]: Object.assign({}, state[action.homeID].roomCalendars[action.roomID], {
              data: action.result,
            }),
          }),
        }),
      }
    case LOAD_ROOM_CALENDAR_FAIL:
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          roomCalendars: Object.assign({}, state[action.homeID].roomCalendars, {
            [action.roomID]: Object.assign({}, state[action.homeID].roomCalendars[action.roomID], {
              loading: false,
              loaded: false,
              error: action.error,
            }),
          }),
        }),
      }
    default:
      return state
  }
}

export function isLoaded(globalState, homeID) {
  return typeof globalState.publicData.homestays[homeID] === 'object' && globalState.publicData.homestays[homeID].loaded
}

export function load(homeID) {

  return async dispatch => {

    if (__CLIENT__) dispatch(showLoading())
    dispatch({ type: LOAD_HOMESTAY, homeID })

    try {

      return new Promise((resolve, reject) => {
        const request = superagent.get(`${config.apiHost}/public/homes/${homeID}`)
        request.end((err, { body } = {}) => {

          if (err) {

            if (__CLIENT__) dispatch(hideLoading())
            reject(dispatch({ type: LOAD_HOMESTAY_FAIL, homeID, err }))

          } else {

            // Load was successful
            if (__CLIENT__) dispatch(hideLoading())
            resolve(dispatch({ type: LOAD_HOMESTAY_SUCCESS, homeID, result: body }))

          }

        })
      })

    } catch (err) {
      dispatch({ type: LOAD_HOMESTAY_FAIL, homeID, err })
      if (__CLIENT__) dispatch(hideLoading())
    }
  }
}

export function loadRoomCalendar(homeID, roomID, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: LOAD_ROOM_CALENDAR, homeID, roomID })

    try {

      const request = superagent.get(`/public/room-availability-calendar/${roomID}`)
      request.end((err, res = {}) => {

        if (err) {

          dispatch({ type: LOAD_ROOM_CALENDAR_FAIL, homeID, roomID, err })

        } else {

          // GET was successful
          dispatch({ type: LOAD_ROOM_CALENDAR_SUCCESS, homeID, roomID, result: JSON.parse(res.text) })
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: LOAD_ROOM_CALENDAR_FAIL, homeID, roomID, err })
    }
  }
}
