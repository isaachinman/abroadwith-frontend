import config from 'config.js'
import superagent from 'superagent'
import { login, facebookLogin, googleLogin } from 'redux/modules/auth'

// Login stuff
const SIGNUP = 'auth/SIGNUP'
const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS'
const SIGNUP_FAIL = 'auth/SIGNUP_FAIL'

const initialState = {
  loading: false,
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SIGNUP:
      return {
        ...state,
        loading: true,
      }
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      }
    case SIGNUP_FAIL:
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

export function signup(type, signupObject, googleToken) {
  return async dispatch => {

    dispatch({ type: SIGNUP })

    try {

      const { email, password, facebookToken, googleId } = signupObject // eslint-disable-line

      const request = superagent.post(`${config.apiHost}/users`).send(signupObject).withCredentials()

      request.end(err => {

        if (err) {

          dispatch({ type: SIGNUP_FAIL, err })

        } else {

          // Signup was success
          dispatch({ type: SIGNUP_SUCCESS })

          // Log the user in
          if (type === 'email') {
            dispatch(login(email, password))
          } else if (type === 'facebook') {
            dispatch(facebookLogin(email, facebookToken))
          } else if (type === 'google') {
            dispatch(googleLogin(email, googleToken))
          }


        }


      })

    } catch (err) {
      dispatch({ type: SIGNUP_FAIL, err })
    }
  }
}
