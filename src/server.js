var express = require('express');
var basicAuth = require('basic-auth-connect');
var http = require('http');
var nunjucks = require('nunjucks');

/** Page Installers **/
var installSearch = require('./search/SearchInstaller');
var installMain = require('./main/MainInstaller');
var installManageHome = require('./manage-home/ManageHomeInstaller');
var installHomes = require('./homes/HomesInstaller');
var installUsers = require('./users/UsersInstaller');
var installUserEdit = require('./users-edit/UserEditInstaller');
var installInbox = require('./inbox/InboxInstaller');
var installAdmin = require('./admin/AdminInstaller');
var installStatic = require('./static/StaticInstaller');
var installImageUpload = require('./upload/ImageUploadInstaller');
var installBooking = require('./booking/BookingInstaller');
var installReservations = require('./reservations/ReservationsInstaller');
var installTrips = require('./trips/TripsInstaller');
var installVerification = require('./verification/VerificationInstaller');
var installInvoice = require('./invoice/InvoiceInstaller');
var installReceipt = require('./receipt/ReceiptInstaller');
var installReview = require('./review/ReviewInstaller');

/** Middlewares **/
var contextLoader = require('./global/middlewares/ContextLoader');
var authentication = require('./global/middlewares/Authentication');

var app = express();
var cookieParser = require('cookie-parser');
nunjucks.configure('src',{watch:true});

app.use(express.static('build'));
app.use(cookieParser());

app.use('/*', contextLoader);

app.use('/*', authentication);

/** BEGIN TEST **/
//TODO remove this.
var installTest = require('./test/TestInstaller');
var installMessaging = require('./test/MessagingInstaller');
installTest(app);
installMessaging(app);
/** END TEST **/

installImageUpload(app);

installMain(app);

installHomes(app);

installUsers(app);

installUserEdit(app);

installInbox(app);

installAdmin(app);

installSearch(app);

installManageHome(app);

installStatic(app);

installBooking(app);

installReservations(app);

installTrips(app);

installVerification(app);

installInvoice(app);

installReceipt(app);

installReview(app);

http.createServer(app).listen(3000);
