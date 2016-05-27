var router = require('./TripsRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {
  app.use('/trips',bouncer)
  app.use('/trips',router)
  app.use('/es/trips',router)
  app.use('/de/trips',router)
}

module.exports = installer
