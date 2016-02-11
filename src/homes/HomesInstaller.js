var router = require('./HomesRouter');
var idHandler = require('./HomesIdHandler');

var installer = function(app) {
  app.use('/homes/:id/',router);
  app.param('id',idHandler);
};

module.exports = installer;
