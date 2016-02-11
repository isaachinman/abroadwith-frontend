var router = require('./AdminRouter');

var installer = function(app) {
  app.use('/admin',router);
};

module.exports = installer;
