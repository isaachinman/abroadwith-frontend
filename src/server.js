var express = require('express');
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
var installImmersionConfirmation = require('./immersion-confirmation/ImmersionConfirmationInstaller');

/** Middlewares **/
var contextLoader = require('./global/middlewares/ContextLoader');
var authentication = require('./global/middlewares/Authentication');
var ServerSettings = require('./ServerSettings');

var app = express();
var cookieParser = require('cookie-parser');
nunjucks.configure('src',{watch:true});

var server = http.createServer(app)
server.listen(ServerSettings.port);

app.use(express.static('build'));
app.use(cookieParser());

app.use('/*', contextLoader);

app.use('/*', authentication);

var winston = require('winston');
winston.add(require('winston-daily-rotate-file'), {
  filename: 'logs/requests.log',
  datePattern: '.yyyy-MM-dd'
});
winston.remove(winston.transports.Console);

app.use(function(req, res, next) {
  var log = {};
  log.baseUrl = req.baseUrl;
  log.originalUrl = req.originalUrl
  log.path = req.path;
  log.hostname = req.hostname;
  log.query = req.query;
  log.ip = req.ip;
  log.headers = req.headers;
  log.method = req.method;
  log.params = req.params;
  log.query = req.query;
  log.secure = req.secure;
  log.cookies = req.cookies;
  log.user = req.logged_user;
  winston.info("[Request]",log);
  next();
});

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

installImmersionConfirmation(app);

app.post('/logout',function(req,res){
  res.cookie('access_token',"null", { secure:true, httpOnly: true, expires:new Date(0), domain:ServerSettings.cookieDomain });
  res.header("Access-Control-Allow-Credentials","true");
  res.sendStatus(200);
});

app.post('/shutdown',function (req, res, next) {
    function gracefulShutdown() {
      //res.removeListener('close', afterRequest);
      res.removeListener('finish', gracefulShutdown);
      console.log("Received kill signal, shutting down gracefully.");
      server.close(function() {
        console.log("Closed out remaining connections.");
        process.exit()
      });

      setTimeout(function() {
           console.error("Could not close connections in time, forcefully shutting down.");
           process.exit()
      }, 10*1000);
    }

    if(req.headers.authorization === "Basic NmQwODgwMjM6ODRjZjA1ZGFmNTZhNGZmNWFlZmRkYzhlMWQwMDE3YTA="){
      res.on('finish', gracefulShutdown);
      res.sendStatus(200);
    }
    else{
      res.sendStatus(403)
    }
});


app.use(function(err, req, res, next) {
  console.log(err.stack);
  winston.error("[ERROR]",err);
  res.redirect("/");
});

app.use(function(req, res, next) {
  winston.error("[ERROR]","Page not found.");
  res.redirect("/");
});
