var router = require('./ReceiptRouter');
var bouncer = require('../global/middlewares/Bouncer');

var installer = function(app) {
  app.use('/users/*/bookings/*/receipt',bouncer);
  app.use('/users/*/bookings/*/receipt',router); //TODO fix this
};

module.exports = installer;
