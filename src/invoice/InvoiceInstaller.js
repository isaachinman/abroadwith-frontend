var router = require('./InvoiceRouter');

var installer = function(app) {
  app.use('/users/*/bookings/*/invoice',router);
};

module.exports = installer;
