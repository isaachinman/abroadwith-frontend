var router = require('./BookingRouter')

var installer = function(app) {
  app.use('/homestay/:homeId/booking',router)
  app.use('/es/homestay/:homeId/booking',router)
  app.use('/de/homestay/:homeId/booking',router)
};

module.exports = installer
