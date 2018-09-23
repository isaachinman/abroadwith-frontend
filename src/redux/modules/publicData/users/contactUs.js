import superagent from 'superagent'

const CONTACT_US_REQUEST = 'abroadwith/CONTACT_US_REQUEST'
const CONTACT_US_REQUEST_SUCCESS = 'abroadwith/CONTACT_US_REQUEST_SUCCESS'
const CONTACT_US_REQUEST_FAIL = 'abroadwith/CONTACT_US_REQUEST_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CONTACT_US_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case CONTACT_US_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      }
    case CONTACT_US_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      }
    default:
      return state
  }
}

export function contactUsRequest(contactRequestData) {

  return async dispatch => {

    dispatch({ type: CONTACT_US_REQUEST })

    try {

      const request = superagent.post('/contact-us')
      request.send(contactRequestData)

      request.end(err => {

        if (err) {

          dispatch({ type: CONTACT_US_REQUEST_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: CONTACT_US_REQUEST_SUCCESS })

        }

      })

    } catch (err) {
      dispatch({ type: CONTACT_US_REQUEST_FAIL, err })
    }
  }

}
