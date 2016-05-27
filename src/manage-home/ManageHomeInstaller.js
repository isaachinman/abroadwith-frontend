var router = require('./ManageHomeRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {
  app.use('/manage-home',bouncer)
  app.use('/manage-home',router)
  app.use('/es/manage-home',router)
  app.use('/de/manage-home',router)
}

module.exports = installer
