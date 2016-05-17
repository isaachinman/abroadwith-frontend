var router = require('./ReviewRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {
  app.use('/users/*/review',bouncer)
  app.use('/users/*/review',router)
  app.use('/es/users/*/review',router)
  app.use('/de/users/*/review',router)
}

module.exports = installer
