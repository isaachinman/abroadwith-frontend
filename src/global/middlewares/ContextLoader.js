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

  if (req.cookies['ui-language'] && ui_languages[req.cookies['ui-language']]) {

    // If a cookie already exists, respect its value
    req.language = req.cookies['ui-language']
    res.cookie('ui-language', req.cookies['ui-language'])

  } else if (req.headers['accept-language'] && ui_languages[req.headers['accept-language']]) {

    // Get accept-language value from browser request header
    var browserLanguage = req.headers['accept-language'].substring(0,2)
    req.language = browserLanguage
    res.cookie('ui-language', browserLanguage)

  } else {
    req.language = 'en'
    res.cookie('ui-language', 'en')
  }

  // // Now that cookie is set, do some redirect stuff
  // if (req.language == 'en') {
  //
  //   // If the language is English, redirect away from any foreign subdomains
  //   var onForeignSite = false
  //   for (key in ui_languages) {
  //     if (req._parsedOriginalUrl.href.indexOf('/'+key+'/') > -1) {
  //       onForeignSite = true
  //       var languageToRemove = key
  //     }
  //   }
  //
  //   if (onForeignSite === true) {
  //     var newPath = req._parsedOriginalUrl.href.replace('/'+languageToRemove+'/', '')
  //     res.redirect(ServerSettings.redirect_domain+newPath)
  //     res.end()
  //     return
  //   }
  //
  // } else {
  //
  //   var onRightSite = true
  //
  //   req._parsedOriginalUrl.href.indexOf('/'+req.language) === -1 ? onRightSite = false : null
  //
  //   for (key in ui_languages) {
  //     if (key != req.language && req._parsedOriginalUrl.href.indexOf('/'+key) > -1) {
  //       onRightSite = false
  //       var languageToRemove = key
  //     }
  //   }
  //
  //   if (onRightSite === false) {
  //     var newPath = req._parsedOriginalUrl.href.replace('/'+languageToRemove, '')
  //     res.redirect(ServerSettings.redirect_domain+'/'+req.language+newPath)
  //     res.end()
  //     return
  //   }
  //
  // }

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
