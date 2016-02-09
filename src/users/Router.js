var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

router.get('/*', function (req, res) {
  if(req.language && translations[req.language])
    context = { translations: translations[req.language]};
  else
    context = { translations: translations['eng']};
  var user_path = "../../mockups/users/";
  if(req.requested_user){
    user_path += req.requested_user;
  }
  else{
    user_path += 1;
  }
  context.user = require(user_path);
  console.log(context);
  res.send(nunjucks.render('users/users.html',context));
});

module.exports = router;
