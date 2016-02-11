var router = require('./UsersRouter');
var idHandler = require('./UsersIdHandler');

var installer = function(app) {
  app.use('/users/:userId/',router);
  app.param('userId',idHandler);
};

module.exports = installer;
