// This util converts an FE course search object into an object
// which is consumable by the BE endpoint

// The purpose of this is to keep the course search object on the FE
// similar to the homestay search object so that code can be reused

export default params => {

  const apiParams = Object.assign({}, params, {
    startDate: params.arrival,
    endDate: params.departure,
    rectangularBounds: {
      southWest: {
        lat: params.mapData.bounds.maxLat,
        lng: params.mapData.bounds.maxLng,
      },
      northEast: {
        lat: params.mapData.bounds.minLat,
        lng: params.mapData.bounds.minLng,
      },
    },
  })

  delete apiParams.arrival
  delete apiParams.departure
  delete apiParams.locationString
  delete apiParams.mapData

  return apiParams

}
