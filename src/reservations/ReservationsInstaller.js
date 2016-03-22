var router = require('./ReservationsRouter');
var bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/reservations',bouncer);
  app.use('/reservations',router);
};

module.exports = installer;
