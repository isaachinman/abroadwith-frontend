var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

router.get('/', function (req, res) {
  context = {
    translations: translations[req.language],
    home: req.home_info
  };
  res.send(nunjucks.render('homes/homes.html',context));
});

module.exports = router;
