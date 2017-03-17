import config from 'config'
import superagent from 'superagent'

// Load public educator object
const LOAD_EDUCATOR = 'abroadwith/LOAD_EDUCATOR'
const LOAD_EDUCATOR_SUCCESS = 'abroadwith/LOAD_EDUCATOR_SUCCESS'
const LOAD_EDUCATOR_FAIL = 'abroadwith/LOAD_EDUCATOR_FAIL'

// Load educator city based on lat/lng
const LOAD_EDUCATOR_CITY = 'abroadwith/LOAD_EDUCATOR_CITY'
const LOAD_EDUCATOR_CITY_SUCCESS = 'abroadwith/LOAD_EDUCATOR_CITY_SUCCESS'
const LOAD_EDUCATOR_CITY_FAIL = 'abroadwith/LOAD_EDUCATOR_CITY_FAIL'

// Load educator courses
const LOAD_EDUCATOR_COURSES = 'abroadwith/LOAD_EDUCATOR_COURSES'
const LOAD_EDUCATOR_COURSES_SUCCESS = 'abroadwith/LOAD_EDUCATOR_COURSES_SUCCESS'
const LOAD_EDUCATOR_COURSES_FAIL = 'abroadwith/LOAD_EDUCATOR_COURSES_FAIL'

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
        [action.result.id]: Object.assign({}, state[action.result.id], action.result),
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
        [action.educatorID]: Object.assign({}, state[action.educatorID], {
          city: action.result,
        }),
      }
    case LOAD_EDUCATOR_COURSES:
      return {
        ...state,
        [action.educatorID]: Object.assign({}, state[action.educatorID], {
          courses: {
            loading: true,
            loaded: false,
          },
        }),
      }
    case LOAD_EDUCATOR_COURSES_SUCCESS:
      return {
        ...state,
        [action.educatorID]: Object.assign({}, state[action.educatorID], {
          courses: {
            loading: false,
            loaded: true,
            data: action.result,
          },
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

        // Behaviour is fundamentally different on server vs client
        if (typeof window === 'undefined') {

          const request = superagent.get(`${config.solr.host}:${config.solr.port}/solr/abroadwith_cities/select?wt=json&q={!func}geodist()&sfield=location&pt=${coords.lat},${coords.lng}&sort=score asc&rows=1`)
          request.end((err, res) => {

            if (err) {

              reject(dispatch({ type: LOAD_EDUCATOR_CITY_FAIL, err, educatorID }))

            } else {

              // Request was successful
              resolve(dispatch({ type: LOAD_EDUCATOR_CITY_SUCCESS, result: res.cityName, educatorID }))

            }


          })

        } else {

          const request = superagent.post('/public/closest-city')
          request.send(coords)

          request.end((err, res) => {

            if (err) {

              reject(dispatch({ type: LOAD_EDUCATOR_CITY_FAIL, err, educatorID }))

            } else {

              // Request was successful
              resolve(dispatch({ type: LOAD_EDUCATOR_CITY_SUCCESS, result: res.body.cityName, educatorID }))

            }

          })
        }

      })

    } catch (err) {
      dispatch({ type: LOAD_EDUCATOR_CITY_FAIL, err, educatorID })
    }
  }

}

export function loadEducatorCourses(educatorID) {

  return async dispatch => {

    dispatch({ type: LOAD_EDUCATOR_COURSES, educatorID })

    try {

      return new Promise((resolve, reject) => {

        // Behaviour is fundamentally different on server vs client
        if (typeof window === 'undefined') {

          const request = superagent.get(`${config.solr.host}:${config.solr.port}/solr/abroadwith_courses/select?q=educatorId%3A${educatorID}&wt=json&indent=true&rows=100`)
          request.end((err, res) => {

            if (err) {

              reject(dispatch({ type: LOAD_EDUCATOR_COURSES_FAIL, err, educatorID }))

            } else {

              console.log('COURSE RES: ', JSON.parse(res.text).response)
              // Request was successful
              resolve(dispatch({ type: LOAD_EDUCATOR_COURSES_SUCCESS, result: JSON.parse(res.text).response.docs, educatorID }))

            }

          })

        } else {

          const request = superagent.post('/public/educator-courses')
          request.send({ educatorID })

          request.end((err, res) => {

            if (err) {

              reject(dispatch({ type: LOAD_EDUCATOR_COURSES_FAIL, err, educatorID }))

            } else {

              // Request was successful
              resolve(dispatch({ type: LOAD_EDUCATOR_COURSES_SUCCESS, result: res.body, educatorID }))

            }

          })

        }

      })

    } catch (err) {
      dispatch({ type: LOAD_EDUCATOR_COURSES_FAIL, err, educatorID })
    }
  }

}
