const router = require('./ImmersionConfirmationRouter');
const bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/users/*/reservations/*/confirmation',bouncer)
  app.use('/users/*/reservations/*/confirmation',router)
  app.use('/es/users/*/reservations/*/confirmation',router)
  app.use('/de/users/*/reservations/*/confirmation',router)
}

module.exports = installer;
