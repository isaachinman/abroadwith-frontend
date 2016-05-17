const router = require('./VerificationRouter')

var installer = function(app) {
  app.use('/verify/email',router)
  app.use('/es/verify/email',router)
  app.use('/de/verify/email',router)
}

module.exports = installer
