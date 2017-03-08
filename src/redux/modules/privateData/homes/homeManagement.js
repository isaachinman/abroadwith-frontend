import jwtDecode from 'jwt-decode'
import config from 'config'
import { load as loadUserWithAuth, update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
import { loadHomestayCalendar } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import superagent from 'superagent'
import { push } from 'react-router-redux'
import { openVerifyEmailModal } from 'redux/modules/ui/modals'

// Create homestay
const CREATE_HOMESTAY = 'abroadwith/CREATE_HOMESTAY'
const CREATE_HOMESTAY_SUCCESS = 'abroadwith/CREATE_HOMESTAY_SUCCESS'
const CREATE_HOMESTAY_FAIL = 'abroadwith/CREATE_HOMESTAY_FAIL'

// Toggle home pausing
const TOGGLE_HOME_PAUSING = 'abroadwith/TOGGLE_HOME_PAUSING'
const TOGGLE_HOME_PAUSING_SUCCESS = 'abroadwith/TOGGLE_HOME_PAUSING_SUCCESS'
const TOGGLE_HOME_PAUSING_FAIL = 'abroadwith/TOGGLE_HOME_PAUSING_FAIL'

// Delete homestay
const DELETE_HOMESTAY = 'abroadwith/DELETE_HOMESTAY'
const DELETE_HOMESTAY_SUCCESS = 'abroadwith/DELETE_HOMESTAY_SUCCESS'
const DELETE_HOMESTAY_FAIL = 'abroadwith/DELETE_HOMESTAY_FAIL'

const initialState = {
  loading: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_HOMESTAY: {
      return {
        ...state,
        loading: true,
      }
    }
    case CREATE_HOMESTAY_SUCCESS: {
      return {
        ...state,
        loading: false,
      }
    }
    case CREATE_HOMESTAY_FAIL: {
      return {
        ...state,
        loading: false,
      }
    }
    default:
      return state
  }
}

export function createHomestay(jwt, user, redirectToManageHome) {

  return async dispatch => {

    dispatch(showLoading())
    dispatch({ type: CREATE_HOMESTAY })

    try {

      // Non MULTI-type users are not allowed to create multiple homes
      if (user.homeIds.length > 0 && user.feUserType.indexOf('MULTI') === -1) {
        dispatch(hideLoading())
        return dispatch(push('/manage-home'))
      }

      dispatch(loadUserWithAuth(jwt, response => {

        if (response && response.verifications && response.verifications.email) {
          const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes`)
          request.set({ Authorization: `Bearer ${(jwt)}` })

          request.end((err = {}) => {

            if (err) {

              dispatch({ type: CREATE_HOMESTAY_FAIL, err })
              dispatch(hideLoading())

            } else {

              // Request was successful
              dispatch({ type: CREATE_HOMESTAY_SUCCESS })
              dispatch(hideLoading())

              // Optional redirect
              if (redirectToManageHome) {
                dispatch(loadUserWithAuth(jwt, () => dispatch(push('/manage-home'))))
              }

              // This is an action which can change a user's type
              if (user.feUserType === 'STUDENT') {
                dispatch(updateUser(jwtDecode(jwt).rid, Object.assign({}, user, { feUserType: 'STUDENT_AND_HOST' }), jwt))
              }

            }

          })
        } else {
          dispatch({ type: CREATE_HOMESTAY_FAIL, err: 'Email not verified' })
          dispatch(openVerifyEmailModal('CREATE_HOMESTAY'))
          dispatch(hideLoading())
        }


      }))

    } catch (err) {
      dispatch({ type: CREATE_HOMESTAY_FAIL, err })
      dispatch(hideLoading())
    }
  }
}

export function toggleHomePausing(jwt, homeID, pausedStatus) {
  return async dispatch => {

    dispatch({ type: TOGGLE_HOME_PAUSING })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}/pausing`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send({ isPaused: pausedStatus })

      request.end((err = {}) => {

        if (err) {

          dispatch({ type: TOGGLE_HOME_PAUSING_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: TOGGLE_HOME_PAUSING_SUCCESS })
          dispatch(loadHomestayCalendar(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: TOGGLE_HOME_PAUSING_FAIL, err })
    }
  }
}

export function deleteHomestay(jwt) {
  return {
    types: [DELETE_HOMESTAY, DELETE_HOMESTAY_SUCCESS, DELETE_HOMESTAY_FAIL],
    promise: client => client.get(`/users/${jwtDecode(jwt).rid}/homes/${jwtDecode(jwt).hid}`, { auth: jwt }),
  }
}
