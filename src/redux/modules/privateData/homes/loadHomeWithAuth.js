import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'
import { toastr } from 'react-redux-toastr'

// Load homestay
const LOAD_HOMESTAY_WITH_AUTH = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH'
const LOAD_HOMESTAY_WITH_AUTH_SUCCESS = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH_SUCCESS'
const LOAD_HOMESTAY_WITH_AUTH_FAIL = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH_FAIL'

// Update homestay
const UPDATE_HOMESTAY = 'abroadwith/UPDATE_HOMESTAY'
const UPDATE_HOMESTAY_SUCCESS = 'abroadwith/UPDATE_HOMESTAY_SUCCESS'
const UPDATE_HOMESTAY_FAIL = 'abroadwith/UPDATE_HOMESTAY_FAIL'

// Load homestay calendar
const LOAD_HOMESTAY_CALENDAR = 'abroadwith/LOAD_HOMESTAY_CALENDAR'
const LOAD_HOMESTAY_CALENDAR_SUCCESS = 'abroadwith/LOAD_HOMESTAY_CALENDAR_SUCCESS'
const LOAD_HOMESTAY_CALENDAR_FAIL = 'abroadwith/LOAD_HOMESTAY_CALENDAR_FAIL'

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case LOAD_HOMESTAY_CALENDAR: {
      if (state[action.homeID]) {
        return {
          ...state,
          [action.homeID]: Object.assign({}, state[action.homeID], {
            calendar: Object.assign({}, state[action.homeID].calendar, {
              loading: true,
            }),
          }),
        }
      }
      return {
        ...state,
      }
    }
    case LOAD_HOMESTAY_CALENDAR_SUCCESS: {
      if (state[action.homeID]) {
        return {
          ...state,
          [action.homeID]: Object.assign({}, state[action.homeID], {
            calendar: {
              loading: true,
              loaded: true,
              data: action.result,
            },
          }),
        }
      }
      break
    }
    case UPDATE_HOMESTAY: {
      if (state[action.homeID]) {
        return {
          ...state,
          [action.homeID]: Object.assign({}, state[action.homeID], {
            loading: true,
            loaded: false,
          }),
        }
      }
      break
    }
    case LOAD_HOMESTAY_WITH_AUTH:
      if (!state[action.homeID]) {
        return {
          ...state,
          [action.homeID]: {
            loading: true,
            loaded: false,
          },
        }
      }
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          loading: true,
          loaded: false,
        }),
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

export function loadHomestayCalendar(jwt, homeID) {
  return async dispatch => {

    dispatch({ type: LOAD_HOMESTAY_CALENDAR, homeID })

    try {

      const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}/availabilityCalendar`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: LOAD_HOMESTAY_CALENDAR_FAIL, homeID, err })

        } else {

          // Login was successful
          dispatch({ type: LOAD_HOMESTAY_CALENDAR_SUCCESS, homeID, result: body })

        }

      })

    } catch (err) {
      dispatch({ type: LOAD_HOMESTAY_CALENDAR_FAIL, homeID, err })
    }
  }
}

export function updateHomestay(jwt, homeID, originalObject, notificationMessage) {

  // Clean the data
  /* eslint-disable */
  const homeObject = Object.assign({}, originalObject, {})
  delete homeObject.published
  delete homeObject.GENERAL
  delete homeObject.homeActivationResponse
  delete homeObject.isActive
  homeObject.images =  homeObject.images.map(img => {return { caption: img.caption, id: img.id }})
  /* eslint-enable */

  return async dispatch => {

    dispatch({ type: UPDATE_HOMESTAY, homeID })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(homeObject)

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: UPDATE_HOMESTAY_FAIL, homeID, err })

        } else {

          // Request was successful
          dispatch({ type: UPDATE_HOMESTAY_SUCCESS, homeID, result: body })
          dispatch(load(jwt, homeID))

          // Dispatch a notification if necessary
          if (typeof notificationMessage === 'string' && notificationMessage.length > 0) {
            toastr.success(notificationMessage)
          }

        }

      })

    } catch (err) {
      dispatch({ type: UPDATE_HOMESTAY_FAIL, homeID, err })
    }
  }
}
