module.exports = function compileGoogleAddress(place) {

  // Set up initial variables
  var p = {}
  var newAddressObj = {}

  // Loop through the abstruse Google object and push place types into a new object
  $.each(place.address_components, function(k,v1) {$.each(v1.types, function(k2, v2){p[v2]=v1.short_name})})

  // Fallback system
  newAddressObj.city =            p.locality || p.sublocality || p.administrative_area_level_1 || null
  newAddressObj.country =         p.country || p.political || null
  newAddressObj.neighbourhood =   p.neighborhood || p.sublocality_level_2 || p.sublocality_level_1 || p.administrative_area_level_2 || null
  newAddressObj.state =           p.administrative_area_level_1 || null
  newAddressObj.street =          p.street_address || p.street_number && p.route ? p.street_number + ' ' + p.route : false || p.route || p.neighborhood || null
  newAddressObj.lat =             place.geometry.location.lat() || null
  newAddressObj.lng =             place.geometry.location.lng() || null

  // Validate
  var addressIsValid = true
  $.each(newAddressObj, function(component) { component === null ? newAddressObj = null : null })

  console.log(place)
  console.log(newAddressObj)

  // Return the address object
  return newAddressObj

}
