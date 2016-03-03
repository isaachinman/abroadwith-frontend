var router = require('./HomesRouter');
var idHandler = require('../global/middlewares/HomesIdHandler');

var installer = function(app) {
  app.use('/homes/:homeId',router);
  app.param('homeId',idHandler);
};

module.exports = installer;
