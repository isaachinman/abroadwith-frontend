'use strict';

require('jquery');
var select2 = require('select2-browserify');

require('materialize');

// Home page
require('./main/main');

// Search page
require('./search/search');

// Globals
require('./global/signup');
require('./global/login-init');
require('./global/login-redirect');
require('./global/logout-init');
require('./global/home-creation');

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

// Booking
require('./booking/booking')
