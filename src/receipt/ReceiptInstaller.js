var router = require('./ReceiptRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {
  app.use('/users/*/bookings/*/receipt',bouncer)
  app.use('/users/*/bookings/*/receipt',router)
  app.use('/es/users/*/bookings/*/receipt',router)
  app.use('/de/users/*/bookings/*/receipt',router)
}

module.exports = installer
