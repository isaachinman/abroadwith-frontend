var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

router.get('/', function (req, res) {
  if(!req.context) req.context = {};
  console.log(req.context);
  res.send(nunjucks.render('test/test.html',req.context));
});

module.exports = router;
