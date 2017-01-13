import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'
import { load as loadHomeWithAuth } from './loadHomeWithAuth'

// Create ROOM
const CREATE_ROOM = 'abroadwith/CREATE_ROOM'
const CREATE_ROOM_SUCCESS = 'abroadwith/CREATE_ROOM_SUCCESS'
const CREATE_ROOM_FAIL = 'abroadwith/CREATE_ROOM_FAIL'

// Update ROOM
const UPDATE_ROOM = 'abroadwith/UPDATE_ROOM'
const UPDATE_ROOM_SUCCESS = 'abroadwith/UPDATE_ROOM_SUCCESS'
const UPDATE_ROOM_FAIL = 'abroadwith/UPDATE_ROOM_FAIL'

// Delete ROOM
const DELETE_ROOM = 'abroadwith/DELETE_ROOM'
const DELETE_ROOM_SUCCESS = 'abroadwith/DELETE_ROOM_SUCCESS'
const DELETE_ROOM_FAIL = 'abroadwith/DELETE_ROOM_FAIL'

export function createRoom(jwt, homeID, roomObject, roomImg) {

  return async dispatch => {

    dispatch({ type: CREATE_ROOM })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}/rooms`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(roomObject)

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: CREATE_ROOM_FAIL, homeID, err })

        } else {

          // Room creation was successful
          dispatch({ type: CREATE_ROOM_SUCCESS, homeID, result: body })

          console.log('body: ', body)

          // Now upload the roomImg to s3 and associate it with the room
          if (roomImg) {

            const imgRequest = superagent.post(`/upload/users/${jwtDecode(jwt).rid}/homes/${homeID}/rooms/${body.roomId}/photo`)
            imgRequest.set({ abroadauth: `Bearer ${(jwt)}` })

            imgRequest.attach('file', roomImg)


            imgRequest.end(() => {

              // Now refetch the home itself
              dispatch(loadHomeWithAuth(jwt, homeID))

            })
          } else {

            // Now refetch the home itself
            dispatch(loadHomeWithAuth(jwt, homeID))

          }

        }

      })

    } catch (err) {
      dispatch({ type: CREATE_ROOM_FAIL, homeID, err })
    }
  }
}

export function updateRoom(jwt, homeID, homeObject) {

  // Clean the data
  /* eslint-disable */
  delete homeObject.published
  delete homeObject.GENERAL
  delete homeObject.homeActivationResponse
  delete homeObject.isActive
  /* eslint-enable */

  return async dispatch => {

    dispatch({ type: UPDATE_ROOM, homeID })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(homeObject)

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: UPDATE_ROOM_FAIL, homeID, err })

        } else {

          // Request was successful
          dispatch({ type: UPDATE_ROOM_SUCCESS, homeID, result: body })
          dispatch(loadHomeWithAuth(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: UPDATE_ROOM_FAIL, homeID, err })
    }
  }
}

export function deleteRoom(jwt, homeID, roomID) {

  return async dispatch => {

    dispatch({ type: DELETE_ROOM })

    try {

      const request = superagent.delete(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}/rooms/${roomID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: DELETE_ROOM_FAIL, homeID, err })

        } else {

          // Room deletion was successful
          dispatch({ type: DELETE_ROOM_SUCCESS, homeID, result: body })

          // Now refetch the home itself
          dispatch(loadHomeWithAuth(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: DELETE_ROOM_FAIL, homeID, err })
    }
  }
}
