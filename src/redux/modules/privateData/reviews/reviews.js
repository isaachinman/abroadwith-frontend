import jwtDecode from 'jwt-decode'
import config from 'config'
import superagent from 'superagent'

// Create educator review
const CREATE_EDUCATOR_REVIEW = 'abroadwith/CREATE_EDUCATOR_REVIEW'
const CREATE_EDUCATOR_REVIEW_SUCCESS = 'abroadwith/CREATE_EDUCATOR_REVIEW_SUCCESS'
const CREATE_EDUCATOR_REVIEW_FAIL = 'abroadwith/CREATE_EDUCATOR_REVIEW_FAIL'

// Create home review
const CREATE_HOME_REVIEW = 'abroadwith/CREATE_HOME_REVIEW'
const CREATE_HOME_REVIEW_SUCCESS = 'abroadwith/CREATE_HOME_REVIEW_SUCCESS'
const CREATE_HOME_REVIEW_FAIL = 'abroadwith/CREATE_HOME_REVIEW_FAIL'

// Create user review
const CREATE_USER_REVIEW = 'abroadwith/CREATE_USER_REVIEW'
const CREATE_USER_REVIEW_SUCCESS = 'abroadwith/CREATE_USER_REVIEW_SUCCESS'
const CREATE_USER_REVIEW_FAIL = 'abroadwith/CREATE_USER_REVIEW_FAIL'

const initialState = {
  loading: false,
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_EDUCATOR_REVIEW:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
      })
    case CREATE_EDUCATOR_REVIEW_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        data: action.result,
      })
    case CREATE_EDUCATOR_REVIEW_FAIL:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
      })
    case CREATE_HOME_REVIEW:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
      })
    case CREATE_HOME_REVIEW_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        data: action.result,
      })
    case CREATE_HOME_REVIEW_FAIL:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
      })
    case CREATE_USER_REVIEW:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
      })
    case CREATE_USER_REVIEW_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        data: action.result,
      })
    case CREATE_USER_REVIEW_FAIL:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
      })
    default:
      return state
  }
}

export function createEducatorReview(jwt, reviewObject, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: CREATE_EDUCATOR_REVIEW })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/educatorReviews`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(reviewObject)

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: CREATE_EDUCATOR_REVIEW_FAIL, err })

        } else {

          // Creation was successful
          dispatch({ type: CREATE_EDUCATOR_REVIEW_SUCCESS, result: body })

          // Callback
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: CREATE_EDUCATOR_REVIEW_FAIL, err })
    }
  }
}

export function createHomeReview(jwt, reviewObject, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: CREATE_HOME_REVIEW })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/homeReviews`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(reviewObject)

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: CREATE_HOME_REVIEW_FAIL, err })

        } else {

          // Creation was successful
          dispatch({ type: CREATE_HOME_REVIEW_SUCCESS, result: body })

          // Callback
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: CREATE_HOME_REVIEW_FAIL, err })
    }
  }
}

export function createUserReview(jwt, reviewObject, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: CREATE_USER_REVIEW })

    try {

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/reviews`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(reviewObject)

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: CREATE_USER_REVIEW_FAIL, err })

        } else {

          // Creation was successful
          dispatch({ type: CREATE_USER_REVIEW_SUCCESS, result: body })

          // Callback
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: CREATE_USER_REVIEW_FAIL, err })
    }
  }
}
