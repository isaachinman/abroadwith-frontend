var router = require('./ReceiptRouter');

var installer = function(app) {
  app.use('/users/*/bookings/*/receipt',router); //TODO fix this
};

module.exports = installer;
