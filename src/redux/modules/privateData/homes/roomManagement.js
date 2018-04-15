import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'
import { load as loadHomeWithAuth } from './loadHomeWithAuth'

// Create room
const CREATE_ROOM = 'abroadwith/CREATE_ROOM'
const CREATE_ROOM_SUCCESS = 'abroadwith/CREATE_ROOM_SUCCESS'
const CREATE_ROOM_FAIL = 'abroadwith/CREATE_ROOM_FAIL'

// Note: creation and deletion of rooms happens via specific endpoints
// However, updating/modifying existing rooms just happens via the home object

// Update room image
const UPDATE_ROOM_IMAGE = 'abroadwith/UPDATE_ROOM_IMAGE'
const UPDATE_ROOM_IMAGE_SUCCESS = 'abroadwith/UPDATE_ROOM_IMAGE_SUCCESS'
const UPDATE_ROOM_IMAGE_FAIL = 'abroadwith/UPDATE_ROOM_IMAGE_FAIL'

// Delete room
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

export function updateRoomImage(jwt, homeID, roomID, roomImg) {

  return async dispatch => {

    dispatch({ type: UPDATE_ROOM_IMAGE })

    try {

      const imgRequest = superagent.post(`/upload/users/${jwtDecode(jwt).rid}/homes/${homeID}/rooms/${roomID}/photo`)
      imgRequest.set({ abroadauth: `Bearer ${(jwt)}` })

      imgRequest.attach('file', roomImg)

      imgRequest.end(err => {

        if (err) {

          dispatch({ type: UPDATE_ROOM_IMAGE_FAIL, homeID, err })

        } else {

          dispatch({ type: UPDATE_ROOM_IMAGE_SUCCESS, homeID, err })

          // Now refetch the home itself
          dispatch(loadHomeWithAuth(jwt, homeID))
        }

      })

    } catch (err) {
      dispatch({ type: UPDATE_ROOM_IMAGE_FAIL, homeID, err })
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
