export default urlObject => {

  const params = {
    immersions: {},
    mapData: {
      bounds: {},
    },
    filters: [],
  }

  Object.keys(urlObject).map(param => {

    // General truthy check
    if (urlObject[param]) {

      if (['maxLat', 'maxLng', 'minLat', 'minLng'].includes(param)) {

        params.mapData.bounds[param] = urlObject[param]

      } else if (param === 'immersions') {

        const immersionArray = urlObject[param].replace(/,\s*$/, '').split(',')
        params.immersions = {
          stay: immersionArray.indexOf('SI') > -1,
          tandem: immersionArray.indexOf('TA') > -1,
          teacher: immersionArray.indexOf('TE') > -1,
        }

      } else {

        params[param] = urlObject[param]

      }

    }

  })

  return params

}
