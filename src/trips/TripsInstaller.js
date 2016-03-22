var router = require('./TripsRouter');
var bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/trips',bouncer);
  app.use('/trips',router);
};

module.exports = installer;
