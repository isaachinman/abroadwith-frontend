var router = require('./InvoiceRouter');
var bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/users/*/invoices/*/',bouncer);
  app.use('/users/*/invoices/*/',router); //TODO fix this
};

module.exports = installer;
