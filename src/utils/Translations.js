var languages = require('../global/constants/UILanguages.json');

var translations = {};

//FIXME load properly, with character encoding correctly set.
for(var i in languages){
  translations[i]= {};
  translations[i].common = require('../../locales/'+i+"/common.json");
  translations[i].search = require('../../locales/'+i+"/search.json");
  translations[i].main = require('../../locales/'+i+"/main.json");
  translations[i].languages = require('../../locales/'+i+"/languages.json");
}

translations.ui_languages = languages;

module.exports = translations;
