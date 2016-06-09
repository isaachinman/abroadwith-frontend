var router = require('./AdminRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {

  // English
  app.use('/admin',bouncer)
  app.use('/admin',router)

  // Spanish
  app.use('/es/admin',bouncer)
  app.use('/es/admin',router)

  // German
  app.use('/de/admin',bouncer)
  app.use('/de/admin',router)

}

module.exports = installer
