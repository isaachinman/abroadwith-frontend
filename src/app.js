'use strict';

require('jquery');
var select2 = require('select2-browserify');

require('materialize');

// Home page
require('./main/main');

// Search page
require('./search/search');

// Signup
require('./global/signup');

// Modals
require('./partials/modals/1_login/log-in-modal.js')

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

// Facebook scripts
require('./global/facebook');
