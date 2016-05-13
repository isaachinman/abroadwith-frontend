var ServerSettings = require('../../ServerSettings');

module.exports = function (req, res, next) {

  // Only use the bouncer in production
  if (ServerSettings.strict) {
    if(!req.logged_user){
      res.redirect("/login");
      return;
    }
  }
  next();
};
