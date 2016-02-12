var express = require('express');
var basicAuth = require('basic-auth-connect');
var http = require('http');
var nunjucks = require('nunjucks');
var fs = require('fs');
var searchRouter = require('./search/Router');
var installMain = require('./main/MainInstaller');
var manageHomeRouter = require('./manage-home/Router');
var installHomes = require('./homes/HomesInstaller');
var installUsers = require('./users/UsersInstaller');
var usersEditRouter = require('./users-edit/Router');
var installInbox = require('./inbox/InboxInstaller');
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

installMain(app);

installHomes(app);

installUsers(app);

app.use('/users-edit',usersEditRouter);

installInbox(app);

installAdmin(app);

app.use('/test',testRouter);

app.use('/search',searchRouter);

app.use('/manage-home',manageHomeRouter);

http.createServer(app).listen(3000);
