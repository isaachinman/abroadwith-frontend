var express = require('express')
var http = require('http')
var nunjucks = require('nunjucks')
var cookieParser = require('cookie-parser')

// Middlewares
var contextLoader = require('./global/middlewares/ContextLoader')
var authentication = require('./global/middlewares/Authentication')
var ServerSettings = require('./ServerSettings')

// Page Installers
var installSearch = require('./search/SearchInstaller')
var installMain = require('./main/MainInstaller')
var installManageHome = require('./manage-home/ManageHomeInstaller')
var installHomes = require('./homes/HomesInstaller')
var installUsers = require('./users/UsersInstaller')
var installUserEdit = require('./users-edit/UserEditInstaller')
var installInbox = require('./inbox/InboxInstaller')
var installAdmin = require('./admin/AdminInstaller')
var installStatic = require('./static/StaticInstaller')
var installImageUpload = require('./upload/ImageUploadInstaller')
var installBooking = require('./booking/BookingInstaller')
var installReservations = require('./reservations/ReservationsInstaller')
var installTrips = require('./trips/TripsInstaller')
var installVerification = require('./verification/VerificationInstaller')
var installInvoice = require('./invoice/InvoiceInstaller')
var installReceipt = require('./receipt/ReceiptInstaller')
var installReview = require('./review/ReviewInstaller')
var installImmersionConfirmation = require('./immersion-confirmation/ImmersionConfirmationInstaller')

// Instantiate the application
var app = express()

// Use nunjucks for html templating
nunjucks.configure('src',{watch:true})

// Start up the server and listen on specified port
var server = http.createServer(app)
server.listen(ServerSettings.port)

// Set up basic settings
app.use(express.static('build'))
app.use(cookieParser())

// Use contextLoader and authentication on all pages
app.use('/*', contextLoader)
app.use('/*', authentication)

// Create a log file for each day of use
var winston = require('winston')
winston.add(require('winston-daily-rotate-file'), {
  filename: 'logs/requests.log',
  datePattern: '.yyyy-MM-dd.json'
})
winston.remove(winston.transports.Console)

// Set up parameters to be logged
app.use(function(req, res, next) {
  var log = {}
  log.baseUrl = req.baseUrl
  log.originalUrl = req.originalUrl
  log.path = req.path
  log.hostname = req.hostname
  log.query = req.query
  log.ip = req.ip
  log.headers = req.headers
  log.method = req.method
  log.params = req.params
  log.query = req.query
  log.secure = req.secure
  log.cookies = req.cookies
  log.user = req.logged_user
  winston.info("[Request]",log)
  next()
})

// Install pages onto the app
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

// This is the logout endpoint
app.post('/logout',function(req,res){

  // Remove the access_token cookie
  res.cookie("access_token", "", { expires: new Date() })
  res.header("Access-Control-Allow-Credentials","true")
  res.sendStatus(200)

});

// This is the shutdown function for deployment
app.post('/shutdown',function (req, res, next) {

  function gracefulShutdown() {
    res.removeListener('finish', gracefulShutdown);
    console.log("Received kill signal, shutting down gracefully.");
    server.close(function() {
      console.log("Closed out remaining connections.");
      process.exit()
    })

    setTimeout(function() {
         console.error("Could not close connections in time, forcefully shutting down.");
         process.exit()
    }, 10*1000)
  }

  if (req.headers.authorization === "Basic NmQwODgwMjM6ODRjZjA1ZGFmNTZhNGZmNWFlZmRkYzhlMWQwMDE3YTA=") {
    res.on('finish', gracefulShutdown)
    res.sendStatus(200)
  } else {
    res.sendStatus(403)
  }

})

app.use(function(err, req, res, next) {
  console.log(err.stack)
  winston.error("[ERROR]",err)
  if (res.statusCode === 503) {
    return res.render('static/maintenance.html')
  }
})

// Render 404 page if not found
app.use(function(req, res, next) {
  winston.error("[ERROR]","Page not found.")
  return res.status(404).send(nunjucks.render('static/not-found.html',req.context))
})
