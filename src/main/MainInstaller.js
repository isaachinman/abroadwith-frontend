var router = require('./MainRouter');

var installer = function(app) {
  app.use(['/es','/index.html?','/'], router)
  app.use(['/de','/index.html?','/'], router)
};

module.exports = installer;
