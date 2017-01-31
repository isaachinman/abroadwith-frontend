export default urlObject => {

  console.log('inside url function')
  console.log('url object: ', urlObject)

  const params = {
    mapData: {
      bounds: {},
    },
  }

  Object.keys(urlObject).map(param => {

    // General truthy check
    if (urlObject[param]) {

      if (!['maxLat', 'maxLng', 'minLat', 'minLng'].includes(param)) {
        params[param] = urlObject[param]
      } else {
        params.mapData.bounds[param] = urlObject[param]
      }

    }

  })

  console.log('about to return these: ', params)
  console.log('bounds: ', params.mapData.bounds)

  return params

}
