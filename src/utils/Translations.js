var languages = ["en","pt","es"];
var translations = {};

//FIXME load properly, with character encoding correctly set.
for(var i = 0; i < languages.length; i++){
  translations[languages[i]]= {};
  translations[languages[i]].common = require('../../locales/'+languages[i]+"/common.json");
  translations[languages[i]].search = require('../../locales/'+languages[i]+"/search.json");
  translations[languages[i]].search = require('../../locales/'+languages[i]+"/main.json");
}

module.exports = translations;
