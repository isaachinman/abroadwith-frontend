import config from 'config'
import jwtDecode from 'jwt-decode'
import superagent from 'superagent'

// Get all messages (top level info)
const LOAD_INVOICE = 'abroadwith/LOAD_INVOICE'
const LOAD_INVOICE_SUCCESS = 'abroadwith/LOAD_INVOICE_SUCCESS'
const LOAD_INVOICE_FAIL = 'abroadwith/LOAD_INVOICE_FAIL'

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case LOAD_INVOICE:
      return {
        ...state,
        [action.invoiceID]: {
          loading: true,
        },
      }
    case LOAD_INVOICE_SUCCESS:
      console.log('load invoice was successful')
      return {
        ...state,
        [action.result.id]: {
          loading: false,
          loaded: true,
          data: action.result,
        },
      }
    case LOAD_INVOICE_FAIL:
      return {
        ...state,
        [action.invoiceID]: {
          loading: false,
          loaded: false,
          error: true,
          errorMessage: action.error,
        },
      }
    default:
      return state
  }
}

export function loadInvoice(jwt, invoiceID) {
  return async dispatch => {
    try {

      dispatch({ type: LOAD_INVOICE, invoiceID })

      return new Promise((resolve) => {
        const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/invoices/${invoiceID}`)
        request.set({ Authorization: `Bearer ${(jwt)}` })

        request.end((err, { body } = {}) => {

          if (err) {

            dispatch({ type: LOAD_INVOICE_FAIL, err, invoiceID })

          } else if (body) {

            // Request was successful
            resolve(dispatch({ type: LOAD_INVOICE_SUCCESS, result: body }))

          } else {

            resolve(dispatch({ type: LOAD_INVOICE_FAIL, err: 'Unknown error', invoiceID }))

          }

        })
      })

    } catch (err) {
      dispatch({ type: LOAD_INVOICE_FAIL, err, invoiceID })
    }
  }
}
