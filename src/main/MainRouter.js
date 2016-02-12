var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No main context.');
  res.send(nunjucks.render('main/main.html',req.context));
});

module.exports = router;
