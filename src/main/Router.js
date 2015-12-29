var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

router.get('/', function (req, res) {
  if(req.language && translations[req.language])
    context = { translations: translations[req.language]};
  else
    context = { translations: translations['en']};
  res.send(nunjucks.render('index/index.html',context));
});

module.exports = router;
