var router = require('./ReviewRouter');

var installer = function(app) {
  app.use('/users/*/review',router); //TODO fix this
};

module.exports = installer;
