var languages = require('../global/constants/UILanguages.json');

var translations = {};

//FIXME load properly, with character encoding correctly set.
for(var i in languages){
  try{
    translations[i]= {};
    translations[i].common = require('../../locales/'+i+"/common.json");

    translations[i].languages = require('../../locales/'+i+"/languages.json");
    translations[i].countries = require('../../locales/'+i+"/countries.json");
    translations[i].users = require('../../locales/'+i+"/users.json");
    translations[i].homes = require('../../locales/'+i+"/homes.json");
    translations[i].rooms = require('../../locales/'+i+"/rooms.json");
    translations[i].immersions = require('../../locales/'+i+"/immersions.json");

    translations[i].main = require('../../locales/'+i+"/main.json");
    translations[i].search = require('../../locales/'+i+"/search.json");
    translations[i].manage_home = require('../../locales/'+i+"/manage_home.json");
    translations[i].booking = require('../../locales/'+i+"/booking.json");
  }
  catch(e){
    console.log(e);
  }
}

module.exports = translations;
