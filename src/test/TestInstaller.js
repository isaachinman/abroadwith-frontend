var router = require('./TestRouter');

var installer = function(app) {
  app.use('/test',router);
};

module.exports = installer;
