'use strict';

require('jquery');
var select2 = require('select2-browserify');

require('materialize');

var i18next = require('i18next');
var i18nextXHR = require('i18next-xhr-backend');
console.log("oie");
i18next.use(i18nextXHR).init({
  backend:{
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  lng: 'en',
  fallbackLng: 'en',
  ns:[]
}, (err, t) => {
  i18next.addResourceBundle('en','common',{key:"OLIE"});
  i18next.loadNamespaces('common');
  i18next.loadNamespaces('common');
  i18next.loadNamespaces('newone');
  console.log(i18next.t('common:stay_description'));
  console.log(i18next.t('common:levels.BEGINNER'));
  console.log(i18next.t('common:key'));
});

// Home page
require('./main/main');

// Search page
require('./search/search');

// Signup
require('./global/signup');

// Modals
require('./partials/modals/1_login/login-modal.js')

// Manage home
require('./manage-home/manage-home');

// Home profile
require('./homes/homes');

// Inbox
require('./inbox/inbox');

// Users edit
require('./users-edit/users-edit');

// Admin
require('./admin/admin');
