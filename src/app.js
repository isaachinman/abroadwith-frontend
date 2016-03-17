'use strict';

require('jquery');
var select2 = require('select2-browserify');

require('materialize');

// Globals
require('./global/currency-dropdown');
require('./global/signup');
require('./global/login-init');
require('./global/login-redirect');
require('./global/logout-init');
require('./global/home-creation');
require('./global/reset-password-request');
require('./global/reset-password-set');

// Home page
require('./main/main');

// Search page
require('./search/search');

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

// Trips
require('./trips/trips')

// Reservations
require('./reservations/reservations')

// Invoice
require('./invoice/invoice')

// Receipt
require('./receipt/receipt')

// Review
require('./review/review')
