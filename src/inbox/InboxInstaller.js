var router = require('./InboxRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {
  app.use('/inbox',bouncer)
  app.use('/inbox',router)
  app.use('/es/inbox',router)
  app.use('/de/inbox',router)
}

module.exports = installer
