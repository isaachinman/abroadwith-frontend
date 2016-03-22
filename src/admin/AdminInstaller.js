var router = require('./AdminRouter');
var bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/admin',bouncer);
  app.use('/admin',router);
};

module.exports = installer;
