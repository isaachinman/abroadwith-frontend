module.exports = function(coordinate) {

  var plus = Math.random() < 0.5 ? true : false;

  if (plus === true) {
    var newCoordinate = coordinate + (Math.random() * 0.0009000009);
  } else {
    var newCoordinate = coordinate + (Math.random() * 0.0009000009);
  }

  return newCoordinate;

}
