var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

router.get('/', function (req, res) {
  context = {
    translations: req.translations
  };
  res.send(nunjucks.render('admin/admin.html',context));
});

module.exports = router;
