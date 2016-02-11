var router = require('./UsersRouter');
var idHandler = require('./UsersIdHandler');

var installer = function(app) {
  app.use('/users/:id/',router);
  app.param('id',idHandler);
};

module.exports = installer;
