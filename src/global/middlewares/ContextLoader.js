var translations = require('../../utils/Translations');
var ui_languages = require('../constants/UILanguages');
var user_languages = require('../constants/UserLanguages');
var user = require('../constants/User');
var home = require('../constants/Home');
var currencies = require('../constants/Currencies');

module.exports = function (req, res, next) {
  var prefix = req.hostname.substring(0,2);
  var value = ui_languages[prefix];

  if(value) {
    req.language = prefix;
  }
  else{
    //TODO read header and/or cookie
    req.language = "en";
  }
  if(!req.context) req.context = {};
  req.context.translations = translations[req.language];
  req.context.constants = {
    user_languages: user_languages,
    ui_languages: ui_languages,
    homes: home,
    users: user,
    currencies: currencies
  }
  next();
};
