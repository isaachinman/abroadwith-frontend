import config from 'config'
import moment from 'moment'
import superagent from 'superagent'

// Perform upsell search
const PERFORM_COURSE_UPSELL_SEARCH = 'abroadwith/PERFORM_COURSE_UPSELL_SEARCH'
const PERFORM_COURSE_UPSELL_SEARCH_SUCCESS = 'abroadwith/PERFORM_COURSE_UPSELL_SEARCH_SUCCESS'
const PERFORM_COURSE_UPSELL_SEARCH_FAIL = 'abroadwith/PERFORM_COURSE_UPSELL_SEARCH_FAIL'

// Get list of cities available
const LOAD_COURSE_CITIES = 'abroadwith/LOAD_COURSE_CITIES'
const LOAD_COURSE_CITIES_SUCCESS = 'abroadwith/LOAD_COURSE_CITIES_SUCCESS'
const LOAD_COURSE_CITIES_FAIL = 'abroadwith/LOAD_COURSE_CITIES_FAIL'

// Get list of languages available
const LOAD_COURSE_LANGUAGES = 'abroadwith/LOAD_COURSE_LANGUAGES'
const LOAD_COURSE_LANGUAGES_SUCCESS = 'abroadwith/LOAD_COURSE_LANGUAGES_SUCCESS'
const LOAD_COURSE_LANGUAGES_FAIL = 'abroadwith/LOAD_COURSE_LANGUAGES_FAIL'

const initialState = {
  citiesAvailable: [],
  languagesAvailable: [],
  upsellSearch: {
    params: {
      categories: [],
      level: 'A1',
      maxDistance: 10,
      pageSize: 3,
      pageOffset: 0,
      sort: {
        parameter: 'DISTANCE',
        order: 'ASC',
      },
    },
    loading: false,
    loaded: false,
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PERFORM_COURSE_UPSELL_SEARCH:
      return {
        ...state,
        upsellSearch: Object.assign({}, state.upsellSearch, {
          loading: true,
        }),
      }
    case PERFORM_COURSE_UPSELL_SEARCH_SUCCESS:
      return {
        ...state,
        upsellSearch: Object.assign({}, state.upsellSearch, {
          loading: false,
          loaded: true,
          data: action.result,
          params: action.params,
        }),
      }
    case PERFORM_COURSE_UPSELL_SEARCH_FAIL:
      return {
        ...state,
        upsellSearch: Object.assign({}, state.upsellSearch, {
          loading: false,
          loaded: false,
          error: action.error,
        }),
      }
    case LOAD_COURSE_CITIES_SUCCESS:
      return {
        ...state,
        citiesAvailable: action.result,
      }
    case LOAD_COURSE_LANGUAGES_SUCCESS:
      return {
        ...state,
        languagesAvailable: action.result,
      }
    default:
      return state
  }
}

export function performCourseUpsellSearch(jwt, params) {

  return async dispatch => {

    dispatch({ type: PERFORM_COURSE_UPSELL_SEARCH })

    try {

      const request = superagent.post(`${config.apiHost}/search/courses`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(params)

      request.end((err, res = {}) => {

        if (err) {

          dispatch({ type: PERFORM_COURSE_UPSELL_SEARCH_FAIL, err })

        } else {

          // GET was successful
          dispatch({ type: PERFORM_COURSE_UPSELL_SEARCH_SUCCESS, result: JSON.parse(res.text), params })

        }

      })

    } catch (err) {
      dispatch({ type: PERFORM_COURSE_UPSELL_SEARCH_FAIL, err })
    }
  }
}

// Currently, this function can only be called serverside due to CORS and insecure response issues from Solr
export function loadCourseCities() {

  return async dispatch => {

    dispatch({ type: LOAD_COURSE_CITIES })

    try {

      return new Promise((resolve, reject) => {

        // Behaviour is fundamentally different on server vs client
        if (typeof window === 'undefined') {

          const fs = require('fs') // eslint-disable-line

          // If cities exist, and were fetched within the time limit, use them locally
          if (fs.existsSync('build/course-data/cities.json') &&
            fs.existsSync('build/course-data/cities.lock') &&
            moment(fs.readFileSync('build/course-data/cities.lock', 'utf-8')).isAfter(moment())) {

            resolve(dispatch({ type: LOAD_COURSE_CITIES_SUCCESS, result: JSON.parse(fs.readFileSync('build/course-data/cities.json', 'utf-8')) }))

          } else {

            // Sometimes new course cities are added by the business team
            // This application refreshes them every day (async depending on actual use)
            const request = superagent.get(`${config.solr.host}:${config.solr.port}/solr/abroadwith_cities/select?q=*&wt=json`)
            request.end((error, response = {}) => {

              if (error) {

                reject(dispatch({ type: LOAD_COURSE_CITIES_FAIL, error }))

              } else {

                // GET was successful
                const data = JSON.parse(response.text).response.docs

                fs.writeFile('build/course-data/cities.json', JSON.stringify(data))
                fs.writeFile('build/course-data/cities.lock', moment().add(1, 'days').toString()) // Adjust cache life here
                resolve(dispatch({ type: LOAD_COURSE_CITIES_SUCCESS, result: data }))

              }

            })

          }

        } else {

          // Because of Solr's insecure/improper response, I've literally set up an endpoint that
          // just runs the above action on the server and then returns it to client
          const request = superagent.get('/public/course-cities')
          request.end((error, response = {}) => {

            if (error) {

              reject(dispatch({ type: LOAD_COURSE_CITIES_FAIL, error }))

            } else {

              resolve(dispatch({ type: LOAD_COURSE_CITIES_SUCCESS, result: JSON.parse(response.text) }))

            }

          })

        }

      })

    } catch (error) {
      dispatch({ type: LOAD_COURSE_CITIES_FAIL, error })
    }
  }
}

// Currently, this function can only be called serverside due to CORS and insecure response issues from Solr
export function loadCourseLanguages() {

  return async dispatch => {

    dispatch({ type: LOAD_COURSE_LANGUAGES })

    try {

      return new Promise((resolve, reject) => {

        // Behaviour is fundamentally different on server vs client
        if (typeof window === 'undefined') {

          const fs = require('fs') // eslint-disable-line

          // If cities exist, and were fetched within the time limit, use them locally
          if (fs.existsSync('build/course-data/languages.json') &&
            fs.existsSync('build/course-data/languages.lock') &&
            moment(fs.readFileSync('build/course-data/languages.lock', 'utf-8')).isAfter(moment())) {

            resolve(dispatch({ type: LOAD_COURSE_LANGUAGES_SUCCESS, result: JSON.parse(fs.readFileSync('build/course-data/languages.json', 'utf-8')) }))

          } else {

            // Sometimes new course languages are added by the business team
            // This application refreshes them every day (async depending on actual use)
            const request = superagent.get(`${config.solr.host}:${config.solr.port}/solr/abroadwith_courses/select?q=*&wt=json&fl=language&group=true&group.field=language`)
            request.end((error, response = {}) => {

              if (error) {

                reject(dispatch({ type: LOAD_COURSE_LANGUAGES_FAIL, error }))

              } else {

                // GET was successful
                const data = JSON.parse(response.text).grouped.language.groups.map(lang => lang.groupValue)

                fs.writeFile('build/course-data/languages.json', JSON.stringify(data))
                fs.writeFile('build/course-data/languages.lock', moment().add(1, 'days').toString()) // Adjust cache life here
                resolve(dispatch({ type: LOAD_COURSE_LANGUAGES_SUCCESS, result: data }))

              }

            })

          }

        } else {

          // Because of Solr's insecure/improper response, I've literally set up an endpoint that
          // just runs the above action on the server and then returns it to client
          const request = superagent.get('/public/course-languages')
          request.end((error, response = {}) => {

            if (error) {

              reject(dispatch({ type: LOAD_COURSE_LANGUAGES_FAIL, error }))

            } else {

              resolve(dispatch({ type: LOAD_COURSE_LANGUAGES_SUCCESS, result: JSON.parse(response.text) }))

            }

          })

        }

      })

    } catch (error) {
      dispatch({ type: LOAD_COURSE_LANGUAGES_FAIL, error })
    }
  }
}
