var router = require('./ManageHomeRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {

  // English
  app.use('/manage-home',bouncer)
  app.use('/manage-home',router)

  // Spanish
  app.use('/es/manage-home',bouncer)
  app.use('/es/manage-home',router)

  // German
  app.use('/de/manage-home',bouncer)
  app.use('/de/manage-home',router)

}

module.exports = installer
