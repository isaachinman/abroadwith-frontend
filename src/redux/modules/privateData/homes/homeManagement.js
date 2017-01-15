import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'
import { load as loadHomeWithAuth } from './loadHomeWithAuth'

// Create homestay
const CREATE_HOMESTAY = 'abroadwith/CREATE_HOMESTAY'
const CREATE_HOMESTAY_SUCCESS = 'abroadwith/CREATE_HOMESTAY_SUCCESS'
const CREATE_HOMESTAY_FAIL = 'abroadwith/CREATE_HOMESTAY_FAIL'

// Update homestay
const UPDATE_HOMESTAY = 'abroadwith/UPDATE_HOMESTAY'
const UPDATE_HOMESTAY_SUCCESS = 'abroadwith/UPDATE_HOMESTAY_SUCCESS'
const UPDATE_HOMESTAY_FAIL = 'abroadwith/UPDATE_HOMESTAY_FAIL'

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

export function createHomestay(jwt) {
  return {
    types: [CREATE_HOMESTAY, CREATE_HOMESTAY_SUCCESS, CREATE_HOMESTAY_FAIL],
    promise: client => client.post(`/users/${jwtDecode(jwt).rid}/homes`, { auth: jwt }),
  }
}

export function updateHomestay(jwt, homeID, originalObject) {

  // Clean the data
  /* eslint-disable */
  console.log('originalObject before: ', originalObject)

  const homeObject = Object.assign({}, originalObject, {})
  delete homeObject.published
  delete homeObject.GENERAL
  delete homeObject.homeActivationResponse
  delete homeObject.isActive
  homeObject.images =  homeObject.images.map(img => {return { caption: img.caption, id: img.id }})
  /* eslint-enable */

  console.log('originalObject after: ', originalObject)

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
          dispatch(loadHomeWithAuth(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: UPDATE_HOMESTAY_FAIL, homeID, err })
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
