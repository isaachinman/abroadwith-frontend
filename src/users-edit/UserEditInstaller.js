var router = require('./UserEditRouter');

var installer = function(app) {
  app.use('/users-edit',router);
};

module.exports = installer;
