var router = require('./ReviewRouter');

var installer = function(app) {
  app.use('/users/*/review',router);
};

module.exports = installer;
