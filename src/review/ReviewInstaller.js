var router = require('./ReviewRouter');

var installer = function(app) {
  app.use('/users/*/reviews/*',router);
};

module.exports = installer;
