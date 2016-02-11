var express = require('express');
var basicAuth = require('basic-auth-connect');
var http = require('http');
var nunjucks = require('nunjucks');
var fs = require('fs');
var searchRouter = require('./search/Router');
var mainRouter = require('./main/Router');
var manageHomeRouter = require('./manage-home/Router');
var installHomes = require('./homes/HomesInstaller');
var usersRouter = require('./users/Router');
var usersEditRouter = require('./users-edit/Router');
var inboxRouter = require('./inbox/Router');
var installAdmin = require('./admin/AdminInstaller');
var testRouter = require('./test/Router');

/** Middlewares **/
var languageLoader = require('./global/middlewares/LanguageLoader');
var authentication = require('./global/middlewares/Authentication');

var app = express();

nunjucks.configure('src',{watch:true});

app.use(express.static('build'));

app.use('/*', languageLoader);

app.use('/*', authentication);

app.use(['/home','/'],mainRouter);

installHomes(app);

app.use('/users',usersRouter);

app.use('/users-edit',usersEditRouter);

app.use('/inbox',inboxRouter);

installAdmin(app);

app.use('/test',testRouter);

app.use('/search',searchRouter);

app.use('/manage-home',manageHomeRouter);

http.createServer(app).listen(3000);
