var router = require('./BookingRouter');

var installer = function(app) {
  app.use('/homestay/:homeId/booking',router);
};

module.exports = installer;
