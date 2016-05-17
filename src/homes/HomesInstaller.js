var router = require('./HomesRouter')
var idHandler = require('../global/middlewares/HomesIdHandler')

var installer = function(app) {
  app.use('/homestay/:homeId',router)
  app.use('/es/homestay/:homeId',router)
  app.use('/de/homestay/:homeId',router)
  app.param('homeId',idHandler)
}

module.exports = installer
