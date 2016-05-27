var router = require('./InvoiceRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {
  app.use('/users/*/invoices/*/',bouncer)
  app.use('/users/*/invoices/*/',router)
  app.use('/es/users/*/invoices/*/',router)
  app.use('/de/users/*/invoices/*/',router)
}

module.exports = installer
