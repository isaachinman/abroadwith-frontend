import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'

// Load homestay
const LOAD_HOMESTAY_WITH_AUTH = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH'
const LOAD_HOMESTAY_WITH_AUTH_SUCCESS = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH_SUCCESS'
const LOAD_HOMESTAY_WITH_AUTH_FAIL = 'abroadwith/LOAD_HOMESTAY_WITH_AUTH_FAIL'

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

// Add teacher certificate
const ADD_TEACHER_CERTIFICATE = 'abroadwith/ADD_TEACHER_CERTIFICATE'
const ADD_TEACHER_CERTIFICATE_SUCCESS = 'abroadwith/ADD_TEACHER_CERTIFICATE_SUCCESS'
const ADD_TEACHER_CERTIFICATE_FAIL = 'abroadwith/ADD_TEACHER_CERTIFICATE_FAIL'

// Load homestay calendar
const LOAD_HOMESTAY_CALENDAR = 'abroadwith/LOAD_HOMESTAY_CALENDAR'
const LOAD_HOMESTAY_CALENDAR_SUCCESS = 'abroadwith/LOAD_HOMESTAY_CALENDAR_SUCCESS'
const LOAD_HOMESTAY_CALENDAR_FAIL = 'abroadwith/LOAD_HOMESTAY_CALENDAR_FAIL'

// Update room calendar
const UPDATE_ROOM_CALENDAR = 'abroadwith/UPDATE_ROOM_CALENDAR'
const UPDATE_ROOM_CALENDAR_SUCCESS = 'abroadwith/UPDATE_ROOM_CALENDAR_SUCCESS'
const UPDATE_ROOM_CALENDAR_FAIL = 'abroadwith/UPDATE_ROOM_CALENDAR_FAIL'

// Resolve room availability conflicts
// This is a synchronous action that just fires when the user is notified about conflicts
const RESOLVE_ROOM_AVAILABILITY_CONFLICTS = 'abroadwith/RESOLVE_ROOM_AVAILABILITY_CONFLICTS'

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case RESOLVE_ROOM_AVAILABILITY_CONFLICTS: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          calendar: Object.assign({}, state[action.homeID].calendar, {
            conflicts: [],
          }),
        }),
      }
    }
    case UPDATE_ROOM_CALENDAR: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          calendar: Object.assign({}, state[action.homeID].calendar, {
            roomsLoading: state[action.homeID].calendar.roomsLoading + 1,
          }),
        }),
      }
    }
    case UPDATE_ROOM_CALENDAR_SUCCESS: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          calendar: Object.assign({}, state[action.homeID].calendar, {
            roomsLoading: state[action.homeID].calendar.roomsLoading - 1,
          }),
        }),
      }
    }
    case UPDATE_ROOM_CALENDAR_FAIL: {
      if (action.err && action.err.status === 409) {
        return {
          ...state,
          [action.homeID]: Object.assign({}, state[action.homeID], {
            calendar: Object.assign({}, state[action.homeID].calendar, {
              conflicts: state[action.homeID].calendar.conflicts.concat([action.roomID]),
              roomsLoading: state[action.homeID].calendar.roomsLoading - 1,
            }),
          }),
        }
      }
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          calendar: Object.assign({}, state[action.homeID].calendar, {
            error: action.error,
            roomsLoading: state[action.homeID].calendar.roomsLoading - 1,
          }),
        }),
      }
    }
    case LOAD_HOMESTAY_CALENDAR: {
      if (state[action.homeID]) {
        return {
          ...state,
          [action.homeID]: Object.assign({}, state[action.homeID], {
            calendar: Object.assign({}, state[action.homeID].calendar, {
              loading: true,
              conflicts: state[action.homeID].calendar ? state[action.homeID].calendar.conflicts : [],
              roomsLoading: state[action.homeID].calendar ? state[action.homeID].calendar.roomsLoading : 0,
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
              loading: false,
              loaded: true,
              data: action.result,
              conflicts: state[action.homeID].calendar ? state[action.homeID].calendar.conflicts : [],
              roomsLoading: state[action.homeID].calendar ? state[action.homeID].calendar.roomsLoading : [],
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
      return {
        ...state,
        [action.homeID]: {
          loading: true,
          loaded: false,
        },
      }
    }
    case ADD_HOME_PHOTO: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          photosLoading: true,
        }),
      }
    }
    case ADD_HOME_PHOTO_SUCCESS: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          photosLoading: false,
        }),
      }
    }
    case ADD_HOME_PHOTO_FAIL: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          photosLoading: false,
          error: action.error,
        }),
      }
    }
    case DELETE_HOME_PHOTO: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          photosLoading: true,
        }),
      }
    }
    case DELETE_HOME_PHOTO_SUCCESS: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          photosLoading: false,
        }),
      }
    }
    case DELETE_HOME_PHOTO_FAIL: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          photosLoading: false,
          error: action.error,
        }),
      }
    }
    case ADD_TEACHER_CERTIFICATE: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          certificateLoading: true,
        }),
      }
    }
    case ADD_TEACHER_CERTIFICATE_SUCCESS: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          certificateLoading: false,
        }),
      }
    }
    case ADD_TEACHER_CERTIFICATE_FAIL: {
      return {
        ...state,
        [action.homeID]: Object.assign({}, state[action.homeID], {
          certificateLoading: false,
          error: action.error,
        }),
      }
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
          certificateLoading: false,
          photosLoading: false,
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

export function load(jwt, homeID, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: LOAD_HOMESTAY_WITH_AUTH, homeID })

    try {

      return new Promise((resolve, reject) => {

        const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}`)
        request.set({ Authorization: `Bearer ${(jwt)}` })

        request.end((err, { body } = {}) => {

          if (err) {

            reject(dispatch({ type: LOAD_HOMESTAY_WITH_AUTH_FAIL, homeID, err }))

          } else {

            // Load was successful
            resolve(dispatch({ type: LOAD_HOMESTAY_WITH_AUTH_SUCCESS, homeID, result: body }))
            cb()

          }

        })

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

export function updateRoomCalendar(jwt, homeID, roomID, calendar) {
  return async dispatch => {

    dispatch({ type: UPDATE_ROOM_CALENDAR, homeID, roomID })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}/rooms/${roomID}/availabilityCalendar`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(calendar)

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: UPDATE_ROOM_CALENDAR_FAIL, homeID, roomID, err })

        } else {

          // Update was successful
          dispatch({ type: UPDATE_ROOM_CALENDAR_SUCCESS, homeID, roomID, result: body })

        }

      })

    } catch (err) {
      dispatch({ type: UPDATE_ROOM_CALENDAR_FAIL, homeID, roomID, err })
    }
  }
}

export function resolveRoomAvailabilityConflicts(homeID) {
  return dispatch => dispatch({ type: RESOLVE_ROOM_AVAILABILITY_CONFLICTS, homeID })
}

export function updateHomestay(jwt, homeID, originalObject, notificationMessage) {

  // Clean the data
  /* eslint-disable */
  const homeObject = Object.assign({}, originalObject)
  delete homeObject.published
  delete homeObject.GENERAL
  delete homeObject.homeActivationResponse
  delete homeObject.isActive
  homeObject.images =  homeObject.images.map(img => {return { caption: img.caption, id: img.id }})
  /* eslint-enable */

  return async dispatch => {

    dispatch({ type: UPDATE_HOMESTAY, homeID })

    try {

      // Validate request
      if (homeObject.images.some(image => !image.id)) {
        throw new Error('One or more home images do not have an ID')
      }

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
          console.log(notificationMessage)

        }

      })

    } catch (err) {
      dispatch({ type: UPDATE_HOMESTAY_FAIL, homeID, err })
    }
  }
}

export function addTeacherCertificate(jwt, homeID, homeObject, newCertificate, newCertificateImg) {

  console.log(jwt, homeID, homeObject, newCertificate, newCertificateImg)

  return async dispatch => {

    dispatch({ type: ADD_TEACHER_CERTIFICATE, homeID })

    try {

      const request = superagent.post(`/upload/users/${jwtDecode(jwt).rid}/certificate`)
      request.set({ abroadauth: `Bearer ${(jwt)}` })
      request.send(newCertificateImg)
      request.attach('file', newCertificateImg)

      request.end((err, res = {}) => {

        if (err || res.status !== 200) {

          dispatch({ type: ADD_TEACHER_CERTIFICATE_FAIL, homeID, err })

        } else {

          const finalCert = Object.assign({}, newCertificate, {
            img: JSON.parse(res.text).location,
          })

          const newHomeObj = homeObject

          if (newHomeObj.immersions.teacher === null) {
            newHomeObj.immersions.teacher = {
              isActive: false,
              certifications: [],
              languagesOffered: [],
            }
          }

          const newTeacherCerts = Object.assign(homeObject.immersions.teacher, {
            certifications: homeObject.immersions.teacher.certifications ?
                              homeObject.immersions.teacher.certifications.concat(finalCert) :
                              [].push(finalCert),
          })

          newHomeObj.immersions.teacher = newTeacherCerts

          dispatch(updateHomestay(jwt, homeID, newHomeObj))

          // // Request was successful
          dispatch({ type: ADD_TEACHER_CERTIFICATE_SUCCESS, homeID, result: res })

        }

      })

    } catch (err) {
      dispatch({ type: ADD_TEACHER_CERTIFICATE_FAIL, homeID, err })
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
          dispatch(load(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: ADD_HOME_PHOTO_FAIL, homeID, err })
    }
  }
}

export function deleteHomePhoto(jwt, homeID, photoID) {

  return async dispatch => {

    dispatch({ type: DELETE_HOME_PHOTO, homeID, photoID })

    try {

      const request = superagent.delete(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homes/${homeID}/images/${photoID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: DELETE_HOME_PHOTO_FAIL, homeID, photoID, err })

        } else {

          // Request was successful
          dispatch({ type: DELETE_HOME_PHOTO_SUCCESS, homeID, photoID, result: body })
          dispatch(load(jwt, homeID))

        }

      })

    } catch (err) {
      dispatch({ type: DELETE_HOME_PHOTO_FAIL, homeID, photoID, err })
    }
  }
}
