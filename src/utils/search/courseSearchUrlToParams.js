export default urlObject => {

  const params = {
    categories: [],
    mapData: {
      bounds: {},
    },
    sort: {
      parameter: null,
      order: null,
    },
  }

  Object.keys(urlObject).map(param => {

    // General truthy check
    if (urlObject[param]) {

      if (['maxLat', 'maxLng', 'minLat', 'minLng'].includes(param)) {

        params.mapData.bounds[param] = urlObject[param]

      } else if (param === 'sort') {

        params.sort.parameter = urlObject[param]

      } else if (param === 'sortOrder') {

        params.sort.order = urlObject[param]

      } else if (param === 'categories') {

        params.categories = urlObject[param].split(',')

      } else if (isNaN(urlObject[param])) {

        // If param is not an integer, do nothing
        params[param] = urlObject[param]

      } else {

        // If it is an integer, parse it
        params[param] = parseInt(urlObject[param])

      }

    }

  })

  // Now validate for any missing paramters
  if (!params.sort.parameter) {
    params.sort = {
      parameter: 'PRICE',
      order: 'ASC',
    }
  }

  return params

}
