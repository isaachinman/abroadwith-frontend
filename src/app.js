// Disable all console logging for production
// console.log = function() {}

// jQuery
require('jquery')

// Main materialize script
require('materialize')

// Custom components
require('./global/button-group')

// Globals
require('./global/currency-dropdown')
require('./global/datepickers')
require('./global/signup')
require('./global/login-init')
require('./global/login-redirect')
require('./global/logout-init')
require('./global/home-creation')
require('./global/go-to-manage-home')
require('./global/reset-password-request')
require('./global/reset-password-set')
require('./global/validate-book-now-buttons')
require('./global/validate-message-buttons')

// Modules
require('./global/components/LanguageModule/language-module')
require('./global/components/VerificationsModule/verifications-module')

// Home page
require('./main/main')

// Search page
require('./search/search')

// Manage home
require('./manage-home/manage-home')

// Home profile
require('./homes/homes')

// Inbox
require('./inbox/inbox')

// Users edit
require('./users-edit/users-edit')

// Admin
require('./admin/admin')

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

// Immersion confirmation
require('./immersion-confirmation/immersion-confirmation')

// Review
require('./review/review')

// Users
require('./users/users')
