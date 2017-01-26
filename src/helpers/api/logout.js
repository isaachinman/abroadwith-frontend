export default (app) => {

  // This is the logout endpoint
  app.post('/logout', (req, res) => {

    // Remove the access_token cookie
    res.cookie('access_token', 'null', { secure: true, httpOnly: true, expires: new Date(0), domain: '.test-abroadwith.com' })
    res.header('Access-Control-Allow-Credentials', 'true')
    res.sendStatus(200)

  })

}
