var router = require('./TripsRouter');

var installer = function(app) {
  app.use('/trips',router);
};

module.exports = installer;
