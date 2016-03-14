var router = require('./ReceiptRouter');

var installer = function(app) {
  app.use('/users/*/bookings/*/receipt',router);
};

module.exports = installer;
