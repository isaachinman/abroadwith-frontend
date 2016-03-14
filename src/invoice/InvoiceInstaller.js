var router = require('./InvoiceRouter');

var installer = function(app) {
  app.use('/users/*/bookings/*',router);
};

module.exports = installer;
