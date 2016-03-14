var router = require('./InvoiceRouter');

var installer = function(app) {
  app.use('/users/*/invoices/*/',router);
};

module.exports = installer;
