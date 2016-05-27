module.exports = function(coordinate) {

  var plus = Math.random() < 0.5 ? true : false

  var newCoordinate = plus === true ? coordinate + (Math.random() * 0.0009000009) : coordinate - (Math.random() * 0.0009000009)

  return newCoordinate

}
