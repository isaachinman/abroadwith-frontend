export default bounds => {

  return {
    maxLat: bounds.se.lat,
    maxLng: bounds.nw.lng,
    minLat: bounds.nw.lat,
    minLng: bounds.se.lng,
  }

}
