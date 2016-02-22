var router = require('./SearchRouter');

var installer = function(app) {
  app.use('/search',router);
};

module.exports = installer;
