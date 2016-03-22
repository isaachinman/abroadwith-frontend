var router = require('./UserEditRouter');
var bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/users-edit',bouncer);
  app.use('/users-edit',router);
};

module.exports = installer;
