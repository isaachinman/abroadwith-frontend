import config from 'config'
import superagent from 'superagent'
import { openResetPasswordModal } from 'redux/modules/ui/modals'
import { push } from 'react-router-redux'

// Request reset email
const REQUEST_RESET_PASSWORD = 'abroadwith/REQUEST_RESET_PASSWORD'
const REQUEST_RESET_PASSWORD_SUCCESS = 'abroadwith/REQUEST_RESET_PASSWORD_SUCCESS'
const REQUEST_RESET_PASSWORD_FAIL = 'abroadwith/REQUEST_RESET_PASSWORD_FAIL'

// Reset password
const RESET_PASSWORD = 'abroadwith/RESET_PASSWORD'
const RESET_PASSWORD_SUCCESS = 'abroadwith/RESET_PASSWORD_SUCCESS'
const RESET_PASSWORD_FAIL = 'abroadwith/RESET_PASSWORD_FAIL'

const initialState = {
  requestEmail: {
    loading: false,
    loaded: false,
  },
  resetPassword: {
    loading: false,
    loaded: false,
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case RESET_PASSWORD:
      return {
        ...state,
        resetPassword: {
          loading: true,
          loaded: false,
        },
      }
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: {
          loading: false,
          loaded: true,
        },
      }
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        resetPassword: {
          loading: false,
          loaded: false,
          err: action.err,
        },
      }
    case REQUEST_RESET_PASSWORD:
      return {
        ...state,
        requestEmail: {
          loading: true,
          loaded: false,
        },
      }
    case REQUEST_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        requestEmail: {
          loading: false,
          loaded: true,
        },
      }
    case REQUEST_RESET_PASSWORD_FAIL:
      return {
        ...state,
        requestEmail: {
          loading: false,
          loaded: false,
          err: action.err,
        },
      }
    default:
      return state
  }
}

export function resetPasswordSet(id, email, password, redirectLocation) {

  return async dispatch => {
    try {

      dispatch({ type: RESET_PASSWORD })

      return new Promise((resolve) => {
        const request = superagent.post(`${config.apiHost}/passwords/set`)
        request.send({ id, email, password })

        request.end(err => {

          if (err) {

            dispatch({ type: RESET_PASSWORD_FAIL, err })

          } else {

            // Request was successful
            resolve(dispatch({ type: RESET_PASSWORD_SUCCESS }))
            dispatch(push(redirectLocation))


          }

        })
      })

    } catch (err) {
      dispatch({ type: RESET_PASSWORD_FAIL, err })
    }
  }

}

export function requestResetPassword(email) {

  return async dispatch => {
    try {

      dispatch({ type: REQUEST_RESET_PASSWORD })

      return new Promise((resolve) => {
        const request = superagent.post(`${config.apiHost}/passwords/reset`)
        request.send({ email })

        request.end(err => {

          if (err) {

            dispatch({ type: REQUEST_RESET_PASSWORD_FAIL, err })

          } else {

            // Request was successful
            resolve(dispatch({ type: REQUEST_RESET_PASSWORD_SUCCESS }))
            dispatch(openResetPasswordModal())

          }

        })
      })

    } catch (err) {
      dispatch({ type: REQUEST_RESET_PASSWORD_FAIL, err })
    }
  }

}
