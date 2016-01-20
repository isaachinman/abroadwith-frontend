var languages = require('../../utils/Translations');

module.exports = function (req, res, next) {
  var prefix = req.hostname.substring(0,2);
  var value = languages.iso[prefix];

  if(value) {
    req.language = value;
    console.log("Called for language "+value);
  }
  else{
    req.language = "eng";
  }
  next();
};
