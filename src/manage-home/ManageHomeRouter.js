var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No manage home context.');
  res.send(nunjucks.render('manage-home/manage-home.html',req.context));
});

module.exports = router;
