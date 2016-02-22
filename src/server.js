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

/** Middlewares **/
var contextLoader = require('./global/middlewares/ContextLoader');
var authentication = require('./global/middlewares/Authentication');

var app = express();

nunjucks.configure('src',{watch:true});

app.use(express.static('build'));

app.use('/*', contextLoader);

app.use('/*', authentication);

installMain(app);

installHomes(app);

installUsers(app);

installUserEdit(app);

installInbox(app);

installAdmin(app);

installSearch(app);

installManageHome(app);

//TODO remove this.
var installTest = require('./test/TestInstaller');
var installMessaging = require('./test/MessagingInstaller');
app.post('/users/login', function(req,res){
  res.send('{"token":"eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoia3VrZS1TZ09OMVowdU9qdXJyMHJlZyIsImlhdCI6MTQ1NTc5ODkzNCwiZXhwIjoxNDU2NDAzNzM0LCJuYmYiOjE0NTU3OTg4MTQsInN1YiI6IlVTRVIiLCJlbWFpbCI6ImlzYWFjQGFicm9hZHdpdGguY29tIiwibmFtZSI6IkRvbiBQaW4iLCJyZXF1ZXN0ZXJJZCI6IkRvbiBQaW4ifQ.aG2fGqmxrt3Ol1f0-u73mCEPfZkg9_KBF13HOKWzZqB_hZg8O5WO81VCaxN5ROcopBcdOEBn5bl3UUM1WgNc9hgUveVqldtVZG3vbAU6DWulZjMMmNr4wQkXp4UiW3WLrlTO2xfUdJY7xfq0EOrweEN1sdW46GrWGZsrBIAU2MOhl_4uMDmMRvoMQCzXQCyx7mopSeMfPrMxsA9egc2_L88CNvTx5PmRuGI3j4NFunpgDSEyA5VlN4s-n-HqBC4tNnsSO7SwESY3SMLgmKubUWtbQdr0swKfyCglpQ1IINysrN8PCK6TNJQGsfsP3UpnPZRexM2fuUl4UxKiUqohow"}');
});
installTest(app);
installMessaging(app);



http.createServer(app).listen(3000);
