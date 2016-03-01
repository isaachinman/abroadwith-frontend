var express = require('express');
var nunjucks = require('nunjucks');

var router1 = express.Router();

router1.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No text context.');
  res.send(nunjucks.render('test/test.html',req.context));
});

var router2 = express.Router();

router2.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No text context.');
  res.send(nunjucks.render('test/build.html',req.context));
});


var installer = function(app) {
  app.use('/test',router1);
  app.use('/build',router2);
};

module.exports = installer;
