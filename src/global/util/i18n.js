var i18next = require('i18next')
var i18nextXHR = require('i18next-xhr-backend')
var Cookies = require('js-cookie')

// Use english as default
if (!Cookies.get('ui-language')) {
  Cookies.set('ui-language', 'en')
}

// Set up i18n options
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

// Set up i18n failure function
i18next.on('failedLoading', function(lng, ns, msg) {
  console.log("Something failed while loading.")
  console.log("lng",lng)
  console.log("ns",ns)
  console.log("msg",msg)
})

module.exports = i18next
