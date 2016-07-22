const express = require('express')
const nunjucks = require('nunjucks')
const http = require('http')
const https = require('https')
const domains = require('../global/constants/domains')
const jwt = require('jsonwebtoken')

var router = express.Router()

router.get('/', function(req, res) {

  if (!req.context) res.status(404).send('No verification context.')

  var post_options = {
    host: domains.API_DOMAIN,
    port: domains.API_PORT,
    path: "/verify/email?secret=" + req.query.secret + "&key=" + req.query.key,
    method: 'POST'
  }

  // Set up the request
  var post_req
  if (domains.API_HTTP == "https") {

    var decodedToken = req.cookies && req.cookies['access_token'] ? jwt.decode(req.cookies['access_token']) : false
    console.log(decodedToken)

    post_req = https.request(post_options, function(response) {

      if (response.statusCode == 204) {
        res.send(nunjucks.render('verification/email-verified-success.html', req.context))
      } else if (decodedToken && decodedToken.cbk !== 1 && decodedToken.cbk !== 3) {
        res.send(nunjucks.render('verification/email-already-verified.html', req.context))
      } else {
        res.send(nunjucks.render('verification/email-verified-failure.html', req.context))
      }

    })

  } else {

    post_req = http.request(post_options, function(response) {

      if (response.statusCode == 204) {
        res.send(nunjucks.render('verification/email-verified-success.html', req.context))
      } else {
        res.send(nunjucks.render('verification/email-verified-failure.html', req.context))
      }
    })

  }

  post_req.on('error', function(e) {
    res.send(nunjucks.render('verification/email-verified-failure.html', req.context))
  })

  post_req.end()
})

module.exports = router
