module.exports = function(coordinate, radius) {

  var r = radius/111300,
    u = Math.random(),
    v = Math.random(),
    w = r * Math.sqrt(u),
    t = 2 * Math.PI * v,
    offset = w * Math.sin(t)

  return coordinate + offset

}
