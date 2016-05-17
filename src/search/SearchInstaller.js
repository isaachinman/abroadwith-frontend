var router = require('./SearchRouter')

var installer = function(app) {
  app.use('/search',router)
  app.use('/es/search',router)
  app.use('/de/search',router)
}

module.exports = installer
