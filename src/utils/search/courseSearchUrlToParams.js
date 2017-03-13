export default urlObject => {

  const params = {
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

      } else {

        params[param] = urlObject[param]

      }

    }

  })

  console.log('about to return these: ', params)
  console.log('bounds: ', params.mapData.bounds)

  return params

}
