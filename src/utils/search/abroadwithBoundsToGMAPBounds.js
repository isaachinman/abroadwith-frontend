export default bounds => {

  return {
    nw: {
      lat: bounds.minLat,
      lng: bounds.maxLng,
    },
    se: {
      lat: bounds.maxLat,
      lng: bounds.minLng,
    },
  }

}
