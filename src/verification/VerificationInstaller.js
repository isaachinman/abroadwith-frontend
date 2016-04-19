const router = require('./VerificationRouter');

var installer = function(app) {
  app.use('/verify/email',router);
};

module.exports = installer;
