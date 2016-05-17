const translations = require('../util/Translations')
const ui_languages = require('../constants/UILanguages')
const user_languages = require('../constants/UserLanguages')
const user = require('../constants/User')
const home = require('../constants/Home')
const currencies = require('../constants/Currencies')
const icons = require('../constants/Icons')
const domains = require('../constants/domains')
const default_bank_currencies = require('../constants/DefaultBankCurrencies')
const ServerSettings = require('../../ServerSettings')

module.exports = function (req, res, next) {

  // Get language subdomain
  var prefix = req.hostname.substring(0,2)
  var value = ui_languages[prefix]

  if (value) {

    // If the user is already on a supported language subdomain, give them that language cookie
    req.language = prefix
    res.cookie('ui-language',prefix)

  } else if (ServerSettings.strict && req.headers['accept-language']) {

    // Get accept-language value from browser request header
    prefix = req.headers['accept-language'].substring(0,2)
    value = ui_languages[prefix]

    // If the accept-language is not english, set it as needed
    if(value && prefix != 'en' && !req.cookies['ui-language']){
      res.cookie('ui-language',prefix);
      res.writeHead(303, {'Location': "https://"+prefix+ServerSettings.redirect_domain+req.originalUrl})
      res.end()
      return
    } else {
      req.language = "en"
      res.cookie('ui-language',"en")
    }
  } else {
    req.language = "en"
    res.cookie('ui-language',"en")
  }

  // If context doesn't exist, create an empty context object
  if (!req.context) {
    req.context = {}
  }

  // Context is dependent on ui language
  req.context.translations = translations[req.language]

  // Set the non-translated constants
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

  // Set some other useful properties
  req.context.baseUrl = req.baseUrl
  req.context.originalUrl = req.originalUrl
  req.context.query = req.query


  if (req.cookies && req.cookies['ui-currency']) {

    // If user has a currency set, use it in context
    req.context.currency = req.cookies['ui-currency']

  } else {

    // Otherwise default to euros
    req.context.currency = 'EUR'
  }
  next()
};
