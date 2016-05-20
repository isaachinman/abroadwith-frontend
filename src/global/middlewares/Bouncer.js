module.exports = function (req, res, next) {

  // If a user tries to access a protected page and isn't logged in, redirect them to the login page
  if (!req.logged_user) {
    res.redirect("/login")
    return
  }

  // Otherwise proceed
  next()

}
