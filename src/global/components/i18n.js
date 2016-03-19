
var i18next = require('i18next');
var i18nextXHR = require('i18next-xhr-backend');
var Cookies = require('js-cookie');

if (!Cookies.get('ui-language')) {
  console.log("UI language undefined. Setting to English");
  Cookies.set('ui-language', 'en');
}

i18next.use(i18nextXHR).init({
  backend:{
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  lng: Cookies.get('ui-language'),
  fallbackLng: 'en',
  ns:[]
});

module.exports = i18next;
