import config from 'config'
import superagent from 'superagent'

// Perform search
const PERFORM_COURSE_UPSELL_SEARCH = 'abroadwith/PERFORM_COURSE_UPSELL_SEARCH'
const PERFORM_COURSE_UPSELL_SEARCH_SUCCESS = 'abroadwith/PERFORM_COURSE_UPSELL_SEARCH_SUCCESS'
const PERFORM_COURSE_UPSELL_SEARCH_FAIL = 'abroadwith/PERFORM_COURSE_UPSELL_SEARCH_FAIL'

const initialState = {
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
