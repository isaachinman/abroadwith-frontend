
var i18next = require('i18next');
var i18nextXHR = require('i18next-xhr-backend');
var Cookies = require('js-cookie');

if (!Cookies.get('ui-language')) {
  Cookies.set('ui-language', 'en');
}

i18next.use(i18nextXHR).init({
  backend:{
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  objectNotation: true,
  lng: Cookies.get('ui-language'),
  fallbackLng: Cookies.get('ui-language'),
  load: 'currentOnly',
  ns:[]
});

i18next.on('failedLoading', function(lng, ns, msg) {
  console.log("Something failed while loading.");
  console.log("lng",lng);
  console.log("ns",ns);
  console.log("msg",msg);
});

module.exports = i18next;
