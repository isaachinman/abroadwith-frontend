const express = require('express')
const nunjucks = require('nunjucks')
const http = require('http')
const https = require('https')
const domains = require('../global/constants/domains')
const ServerSettings = require('../ServerSettings')
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

    var decodedToken = jwt.verify(req.cookies['access_token'], new Buffer(ServerSettings.public_key,'utf8'), { algorithms: ['RS512'] }, function (err, payload) {

      console.log(payload)

      post_req = https.request(post_options, function(response) {

        if (response.statusCode == 204) {
          res.send(nunjucks.render('verification/email-verified-success.html', req.context))
        } else if (payload.cbk !== 1 && payload.cbk !== 3) {
          res.send(nunjucks.render('verification/email-already-verified.html', req.context))
        } else {
          res.send(nunjucks.render('verification/email-verified-failure.html', req.context))
        }

      })

      post_req.on('error', function(e) {
        res.send(nunjucks.render('verification/email-verified-failure.html', req.context))
      })

      post_req.end()

    })

  }

  else {

    post_req = http.request(post_options, function(response) {

      if (response.statusCode == 204) {
        res.send(nunjucks.render('verification/email-verified-success.html', req.context))
      } else {
        res.send(nunjucks.render('verification/email-verified-failure.html', req.context))
      }
    })

  }

})

module.exports = router
