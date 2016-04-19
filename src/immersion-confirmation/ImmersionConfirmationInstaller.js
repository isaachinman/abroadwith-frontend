const router = require('./ImmersionConfirmationRouter');
const bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/users/*/reservations/*/confirmation',bouncer);
  app.use('/users/*/reservations/*/confirmation',router); //TODO fix this
};

module.exports = installer;
