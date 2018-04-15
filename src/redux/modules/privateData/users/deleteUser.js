import config from 'config.js'
import i18n from 'i18next'
import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import { logout } from 'redux/modules/auth'
import notification from 'antd/lib/notification'

// Login stuff
const DELETE_USER = 'auth/DELETE_USER'
const DELETE_USER_SUCCESS = 'auth/DELETE_USER_SUCCESS'
const DELETE_USER_FAIL = 'auth/DELETE_USER_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case DELETE_USER:
      return {
        ...state,
        loading: true,
      }
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      }
    case DELETE_USER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
        errorMessage: action.error,
      }
    default:
      return state
  }
}

export function deleteUser(jwt) {

  return async dispatch => {
    try {

      const request = superagent.delete(`${config.apiHost}/users/${jwtDecode(jwt).rid}`)

      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err) => {

        if (err) {

          dispatch({ type: DELETE_USER_FAIL, err })

          // Users who have approved bookings cannot delete their accounts
          if (err.statusCode === 409) {
            notification.warning({
              key: 'cannotDeleteUserAccount',
              duration: 10,
              message: i18n.t('admin.user_deletion_failure_title'),
              description: i18n.t('admin.user_deletion_failure_paragraph1'),
            })
          }

        } else {

          // Delete was successful
          dispatch({ type: DELETE_USER_SUCCESS })
          dispatch(logout())

        }

      })

    } catch (err) {
      dispatch({ type: DELETE_USER_FAIL, err })
    }
  }
}
