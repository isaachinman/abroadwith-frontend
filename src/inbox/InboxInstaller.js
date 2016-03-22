var router = require('./InboxRouter');
var bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/inbox',bouncer);
  app.use('/inbox',router);
};

module.exports = installer;
