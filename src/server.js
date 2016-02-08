var express = require('express');
var basicAuth = require('basic-auth-connect');
var http = require('http');
var nunjucks = require('nunjucks');
var fs = require('fs');
var searchRouter = require('./search/Router');
var mainRouter = require('./main/Router');
var manageHomeRouter = require('./manage-home/Router');
var homesRouter = require('./homes/Router');
var usersRouter = require('./users/Router');
var inboxRouter = require('./inbox/Router');
var testRouter = require('./test/Router');

/** Middlewares **/
var languageSettings = require('./global/middlewares/LanguageSettings');
var authentication = require('./global/middlewares/Authentication');

var app = express();

var options = {
  key: fs.readFileSync('test-key.pem'),
  cert: fs.readFileSync('test-cert.pem')
};

nunjucks.configure('src',{watch:true});

app.use(express.static('build'));

app.use('/*', languageSettings);

app.use('/*', authentication);

app.use(['/home','/'],mainRouter);

app.use('/homes',homesRouter);

app.use('/users',usersRouter);

app.use('/inbox',inboxRouter);

app.use('/test',testRouter);

app.use('/search',searchRouter);

app.use('/manage-home',manageHomeRouter);

http.createServer(app).listen(3000);
