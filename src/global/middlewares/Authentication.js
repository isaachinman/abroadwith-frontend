const jwt = require('jsonwebtoken');
const fs = require('fs');
const ServerSettings = require('../../ServerSettings');
const winston = require('winston');

module.exports = function (req, res, next) {

  if (req.cookies && req.cookies['access_token']) {

    // If access_token cookie is present, use it to set token and proceed assuming user is logged in
    var token = req.cookies['access_token'];

  } else {

    // Otherwise user is not logged in
    next()
    return

  }

  // Decode token and proceed
  var decoded = jwt.verify(token, new Buffer(ServerSettings.public_key,'utf8'), { algorithms: ['RS512'] }, function (err, payload) {

    if (!err) {

      // Set up user object
      req.logged_user = {}
      req.logged_user.name = payload.name
      req.logged_user.email = payload.email
      req.logged_user.id = payload.rid
      next()
      return

    } else {

      // Report error
      winston.error("[ERROR]",err)
      next()
      return

    }
  })
  
}
