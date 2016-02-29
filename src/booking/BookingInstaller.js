var router = require('./BookingRouter');

var installer = function(app) {
  app.use('/booking',router);
};

module.exports = installer;
