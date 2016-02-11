var translations = require('../../utils/Translations');

module.exports = function (req, res, next) {
  var prefix = req.hostname.substring(0,2);
  var value = translations.ui_languages[prefix];

  if(value) {
    req.language = prefix;
    console.log("Called for language "+req.language);
  }
  else{
    req.language = "en";
  }
  req.translations = translations[req.language];
  next();
};
