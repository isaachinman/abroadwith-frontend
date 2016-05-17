var router = require('./UserEditRouter')
var bouncer = require('../global/middlewares/Bouncer')

var installer = function(app) {
  app.use('/users-edit',bouncer)
  app.use('/users-edit',router)
  app.use('/es/users-edit',router)
  app.use('/de/users-edit',router)
}

module.exports = installer
