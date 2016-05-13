var translations = require('../util/Translations');
var ui_languages = require('../constants/UILanguages');
var user_languages = require('../constants/UserLanguages');
var user = require('../constants/User');
var home = require('../constants/Home');
var currencies = require('../constants/Currencies');
var icons = require('../constants/Icons');
var domains = require('../constants/domains');
var default_bank_currencies = require('../constants/DefaultBankCurrencies');
var ServerSettings = require('../../ServerSettings');

module.exports = function (req, res, next) {
  var prefix = req.hostname.substring(0,2);
  var value = ui_languages[prefix];
  if(value) {
    req.language = prefix;
    res.cookie('ui-language',prefix);
  }
  else{
    if(req.headers['accept-language']){
      if(ServerSettings.strict){
        prefix = req.headers['accept-language'].substring(0,2);
        value = ui_languages[prefix];
        if(value && prefix != 'en' && !req.cookies['ui-language']){
          res.cookie('ui-language',prefix);
          res.writeHead(303, {'Location': "https://"+prefix+ServerSettings.redirect_domain+req.originalUrl});
          res.end()
          return;
        }
        else{
          req.language = "en";
          res.cookie('ui-language',"en");
        }
      }
      else{
        req.language = "en";
        res.cookie('ui-language',"en");
      }
    }
    else{
      req.language = "en";
      res.cookie('ui-language',"en");
    }

  }
  if(!req.context) req.context = {};
  req.context.translations = translations[req.language];
  req.context.constants = {
    user_languages: user_languages,
    ui_languages: ui_languages,
    homes: home,
    users: user,
    currencies: currencies,
    icons: icons,
    domains: domains,
    default_bank_currencies: default_bank_currencies
  }
  req.context.baseUrl = req.baseUrl;
  req.context.originalUrl = req.originalUrl;
  req.context.query = req.query;

  if(req.cookies && req.cookies['ui-currency']){
    req.context.currency = req.cookies['ui-currency'];
  }
  else{
    req.context.currency = 'EUR';
  }
  next();
};
