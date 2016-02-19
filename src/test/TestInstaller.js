var router = require('./HomesRouter');

var installer = function(app) {
  app.use('/test',router);
};

module.exports = installer;
