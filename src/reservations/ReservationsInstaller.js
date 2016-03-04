var router = require('./ReservationsRouter');

var installer = function(app) {
  app.use('/reservations',router);
};

module.exports = installer;
