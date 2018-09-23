import { apiDate } from 'utils/dates'

export default params => {

  let query = '?'

  Object.keys(params).map(param => {

    // General truthy check
    if (params[param] || params[param] === 0) {

      // What follows is a very rudimentary daisy chain parser

      if (param === 'mapData') {

        if (typeof params[param].bounds === 'object') {
          query += `&maxLat=${params[param].bounds.maxLat}&maxLng=${params[param].bounds.maxLng}&minLat=${params[param].bounds.minLat}&minLng=${params[param].bounds.minLng}`
        }

      } else if (param === 'arrival') {

        query += `&arrival=${apiDate(params[param])}`

      } else if (param === 'departure') {

        query += `&departure=${apiDate(params[param])}`

      } else if (param === 'sort') {

        query += `&sort=${params[param].parameter}&sortOrder=${params[param].order}`

      } else {

        query += `&${param}=${params[param]}`

      }

    }

  })

  return query

}
