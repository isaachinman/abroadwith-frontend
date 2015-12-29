var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ' + Date.now() + "IP: "+ req.ip);
  req.language = 'pt';
  next();
});

router.get('/', function (req, res) {
  context = { translations: translations['en']};
  if(req.language && translations[req.language]) context = { translations: translations[req.language]};
  res.send(nunjucks.render('search/search.html',context));
});

module.exports = router;
