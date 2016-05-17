var express = require('express');
var nunjucks = require('nunjucks');

var genericRouter = function(file){
  var router = express.Router();

  router.get('/', function (req, res) {
    if(!req.context) res.status(404).send('No text context.');
    res.send(nunjucks.render(file,req.context));
  });

  return router;
}

var installer = function(app) {

  var staticPages = [
    'terms',
    'privacy',
    'login',
    'signup',
    'reset-password',
    'reset-password-set',
    'about',
    'help',
    'popular-languages-destinations',
    'booking-success',
    'abroadwith-for-students',
    'host-international-students',
    'contact-us',
    'email-verified-success',
    'email-verified-failure',
    'maintenance'
  ]

  for (var i=0; i<staticPages.length; i++) {
    app.use(('/'+staticPages[i]), genericRouter(('static/'+staticPages[i]+'.html')))
    app.use(('/es/'+staticPages[i]), genericRouter(('static/'+staticPages[i]+'.html')))
    app.use(('/de/'+staticPages[i]), genericRouter(('static/'+staticPages[i]+'.html')))
  }


};

module.exports = installer;
