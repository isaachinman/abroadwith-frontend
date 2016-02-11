var router = require('./AdminRouter');
var idHandler = require('./HomesIdHandler');

var installer = function(app) {
  app.use('/admin',router);
};

module.exports = installer;
