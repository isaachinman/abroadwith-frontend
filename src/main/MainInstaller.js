var router = require('./MainRouter');

var installer = function(app) {
  app.use(['/home','/','index.html?'],router);
};

module.exports = installer;
