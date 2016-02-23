
var i18next = require('i18next');
var i18nextXHR = require('i18next-xhr-backend');

i18next.use(i18nextXHR).init({
  backend:{
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  lng: 'en',
  fallbackLng: 'en',
  ns:[]
});

module.exports = i18next;
