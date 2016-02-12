var router = require('./MainRouter');

var installer = function(app) {
  app.use(['/index.html?','/'],router);
};

module.exports = installer;
