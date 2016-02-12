var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No admin context.');
  res.send(nunjucks.render('admin/admin.html',req.context));
});

module.exports = router;
