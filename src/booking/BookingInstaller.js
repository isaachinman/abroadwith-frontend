var router = require('./BookingRouter');

var installer = function(app) {
  app.use('/homes/:homeId/booking',router);
};

module.exports = installer;
