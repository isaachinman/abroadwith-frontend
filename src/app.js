require('jquery');
require('jquery-ui-browserify');

var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');

// Materialize
require('../node_modules/materialize-css/js/global');
require('../node_modules/materialize-css/js/leanModal');
require('../node_modules/materialize-css/js/forms');
require('../node_modules/materialize-css/js/dropdown');
require('../node_modules/materialize-css/js/velocity.min');
require('../node_modules/materialize-css/js/hammer.min');
require('../node_modules/materialize-css/js/jquery.hammer');
require('../node_modules/materialize-css/js/sideNav');
require('../node_modules/materialize-css/js/velocity.min');
require('../node_modules/materialize-css/js/collapsible');
require('../node_modules/materialize-css/js/cards');
require('../node_modules/materialize-css/js/chips');

// Pickadate
require('../node_modules/pickadate/lib/compressed/picker.js');
require('../node_modules/pickadate/lib/compressed/picker.date.js')

// Home page
require('./main/main');

// Search page
require('./search/search');

// Signup
require('./global/signup')
