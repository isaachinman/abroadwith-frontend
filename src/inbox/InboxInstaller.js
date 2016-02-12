var router = require('./InboxRouter');

var installer = function(app) {
  app.use('/inbox',router);
};

module.exports = installer;
