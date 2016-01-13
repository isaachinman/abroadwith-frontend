var languages = {
    en: "English",
    pt: "Português",
    es: "Español"
};

var translations = {};

//FIXME load properly, with character encoding correctly set.
for(var i in languages){
  translations[i]= {};
  translations[i].common = require('../../locales/'+i+"/common.json");
  translations[i].search = require('../../locales/'+i+"/search.json");
  translations[i].main = require('../../locales/'+i+"/main.json");
}

translations.original = languages;

module.exports = translations;
