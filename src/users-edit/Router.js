var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

router.get('/', function (req, res) {
  if(req.language && translations[req.language])
    context = { translations: translations[req.language]};
  else
    context = { translations: translations['eng']};
  var user_path = "../../mockups/users/1";
  context.user = require(user_path);
  res.send(nunjucks.render('users-edit/users-edit.html',context));
});

module.exports = router;
