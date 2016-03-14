var router = require('./InvoiceRouter');

var installer = function(app) {
<<<<<<< HEAD
  app.use('/users/*/invoices/*/',router);
=======
  app.use('/users/*/bookings/*/invoice',router);
>>>>>>> origin/development-unstable
};

module.exports = installer;
