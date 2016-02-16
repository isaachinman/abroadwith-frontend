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
var installUserEdit = require('./users-edit/UserEditInstaller');
var installInbox = require('./inbox/InboxInstaller');
var installAdmin = require('./admin/AdminInstaller');

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

installUserEdit(app);

installInbox(app);

installAdmin(app);

app.use('/search',searchRouter);

app.use('/manage-home',manageHomeRouter);

http.createServer(app).listen(3000);
