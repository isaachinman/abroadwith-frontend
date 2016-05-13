var ServerSettings = require('../../ServerSettings');

module.exports = function (req, res, next) {

  // Only use the bouncer in production
  if (ServerSettings.strict && !req.logged_user) {
    res.redirect("/login")
    return
  }
  next()

}
