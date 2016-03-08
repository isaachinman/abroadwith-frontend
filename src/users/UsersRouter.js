var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No user context.');
  req.context.debug = JSON.stringify(req.context.user);
  res.send(nunjucks.render('users/users.html',req.context));

});

module.exports = router;
