var router = require('./InvoiceRouter');

var installer = function(app) {
  app.use('/users/*/invoices/*/',router); //TODO fix this
};

module.exports = installer;
