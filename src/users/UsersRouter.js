var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

router.get('/', function (req, res) {
  context = {
    translations: req.translations,
    home: req.home_info
  };
  res.send(nunjucks.render('users/users.html',context));
});

module.exports = router;
