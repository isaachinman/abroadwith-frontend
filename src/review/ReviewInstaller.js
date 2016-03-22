var router = require('./ReviewRouter');
var bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/users/*/review',bouncer); 
  app.use('/users/*/review',router); //TODO fix this
};

module.exports = installer;
