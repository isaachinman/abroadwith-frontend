import superagent from 'superagent'

// Load public educator object
const LOAD_EDUCATOR = 'abroadwith/LOAD_EDUCATOR'
const LOAD_EDUCATOR_SUCCESS = 'abroadwith/LOAD_EDUCATOR_SUCCESS'
const LOAD_EDUCATOR_FAIL = 'abroadwith/LOAD_EDUCATOR_FAIL'

// Load public educator object
const LOAD_EDUCATOR_CITY = 'abroadwith/LOAD_EDUCATOR_CITY'
const LOAD_EDUCATOR_CITY_SUCCESS = 'abroadwith/LOAD_EDUCATOR_CITY_SUCCESS'
const LOAD_EDUCATOR_CITY_FAIL = 'abroadwith/LOAD_EDUCATOR_CITY_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_EDUCATOR:
      return {
        ...state,
        loading: true,
      }
    case LOAD_EDUCATOR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        [action.result.id]: action.result,
      }
    case LOAD_EDUCATOR_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      }
    case LOAD_EDUCATOR_CITY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        [action.educatorID]: Object.assign({}, state[action.educatorID], {
          city: action.result,
        }),
      }
    default:
      return state
  }
}

export function isLoaded(globalState, educatorID) {
  return globalState.publicData.educators[educatorID]
}

export function load(educatorID) {
  return {
    types: [LOAD_EDUCATOR, LOAD_EDUCATOR_SUCCESS, LOAD_EDUCATOR_FAIL],
    promise: client => client.get(`/public/educators/${educatorID}`),
  }
}

export function loadEducatorCity(coords, educatorID) {

  return async dispatch => {

    dispatch({ type: LOAD_EDUCATOR_CITY, educatorID })

    try {

      return new Promise((resolve, reject) => {

        const request = superagent.post('/public/closest-city')
        request.send(coords)

        request.end((err, res) => {

          if (err) {

            reject(dispatch({ type: LOAD_EDUCATOR_CITY_FAIL, err, educatorID }))

          } else {


            console.log('res: ', res)
            // Request was successful
            resolve(dispatch({ type: LOAD_EDUCATOR_CITY_SUCCESS, result: res.body.cityName, educatorID }))

          }

        })

      })

    } catch (err) {
      dispatch({ type: LOAD_EDUCATOR_CITY_FAIL, err, educatorID })
    }
  }

}
