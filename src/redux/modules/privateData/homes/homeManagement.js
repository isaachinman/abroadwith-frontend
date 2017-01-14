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

export function updateHomestay(jwt, homeID, homeObject) {

  // Clean the data
  /* eslint-disable */
  delete homeObject.published
  delete homeObject.GENERAL
  delete homeObject.homeActivationResponse
  delete homeObject.isActive
  homeObject.images.map(img => delete img.imagePath)
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
          dispatch(loadHomeWithAuth(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: UPDATE_HOMESTAY_FAIL, homeID, err })
    }
  }
}

export function deleteHomestay(jwt) {
  return {
    types: [DELETE_HOMESTAY, DELETE_HOMESTAY_SUCCESS, DELETE_HOMESTAY_FAIL],
    promise: client => client.get(`/users/${jwtDecode(jwt).rid}/homes/${jwtDecode(jwt).hid}`, { auth: jwt }),
  }
}
