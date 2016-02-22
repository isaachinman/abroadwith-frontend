var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No text context.');
  res.send(JSON.stringify(req.user));
});

var installer = function(app) {
  app.use('/users/:userId/messages',router);
};

module.exports = installer;
