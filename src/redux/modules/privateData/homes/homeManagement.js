import jwtDecode from 'jwt-decode'
import config from 'config'
import { load as loadUserWithAuth, update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
import { load as loadHomeWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'
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

// Add home photo
const ADD_HOME_PHOTO = 'abroadwith/ADD_HOME_PHOTO'
const ADD_HOME_PHOTO_SUCCESS = 'abroadwith/ADD_HOME_PHOTO_SUCCESS'
const ADD_HOME_PHOTO_FAIL = 'abroadwith/ADD_HOME_PHOTO_FAIL'

// Delete home photo
const DELETE_HOME_PHOTO = 'abroadwith/DELETE_HOME_PHOTO'
const DELETE_HOME_PHOTO_SUCCESS = 'abroadwith/DELETE_HOME_PHOTO_SUCCESS'
const DELETE_HOME_PHOTO_FAIL = 'abroadwith/DELETE_HOME_PHOTO_FAIL'

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

        }

      })

    } catch (err) {
      dispatch({ type: TOGGLE_HOME_PAUSING_FAIL, err })
    }
  }
}

export function addHomePhoto(jwt, homeID, acceptedFiles) {

  return async dispatch => {

    dispatch({ type: ADD_HOME_PHOTO, homeID })

    try {

      const request = superagent.post(`/upload/users/${jwtDecode(jwt).rid}/homes/${homeID}/photos`)
      request.set({ abroadauth: `Bearer ${(jwt)}` })
      acceptedFiles.forEach((file) => {
        request.attach('file', file)
      })


      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: ADD_HOME_PHOTO_FAIL, homeID, err })

        } else {

          // Request was successful
          dispatch({ type: ADD_HOME_PHOTO_SUCCESS, homeID, result: body })
          dispatch(loadHomeWithAuth(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: ADD_HOME_PHOTO_FAIL, homeID, err })
    }
  }
}

export function deleteHomePhoto(jwt, homeID, photoID) {

  return async dispatch => {

    dispatch({ type: DELETE_HOME_PHOTO, photoID })

    try {

      const request = superagent.delete(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}/images/${photoID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: DELETE_HOME_PHOTO_FAIL, photoID, err })

        } else {

          // Request was successful
          dispatch({ type: DELETE_HOME_PHOTO_SUCCESS, photoID, result: body })
          dispatch(loadHomeWithAuth(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: DELETE_HOME_PHOTO_FAIL, photoID, err })
    }
  }
}

export function deleteHomestay(jwt) {
  return {
    types: [DELETE_HOMESTAY, DELETE_HOMESTAY_SUCCESS, DELETE_HOMESTAY_FAIL],
    promise: client => client.get(`/users/${jwtDecode(jwt).rid}/homes/${jwtDecode(jwt).hid}`, { auth: jwt }),
  }
}
