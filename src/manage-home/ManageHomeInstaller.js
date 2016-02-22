var router = require('./ManageHomeRouter');

var installer = function(app) {
  app.use('/manage-home',router);
};

module.exports = installer;
