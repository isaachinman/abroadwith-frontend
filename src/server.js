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


app.post('/users/login', function(req,res){
  res.send('{"token":"eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6IkRvbiBQaW4iLCJqdGkiOiJ4WEc2SmxybmZoMWFTOFZpM3J5TTFBIiwiaWF0IjoxNDU1NzA1NDYwLCJleHAiOjE0NTU3MTI2NjAsIm5iZiI6MTQ1NTcwNTM0MCwiZW1haWwiOiJpc2FhY0BhYnJvYWR3aXRoLmNvbSIsIm5hbWUiOiJEb24gUGluIn0.jsA34gfH-y1ZYqP2q7-utvjFK5V626T2MHEjIwCkXH7UenQKgwqfEWHlZLICpzvQZBZvvbAlwcIqeEQ0QS4Mfk3iQOlm1dG5LbH1wxBFTat-ls_1BGuMHwWCQqTF4Orhy31tB9uzo6SmE8pReplJ8qyHLGZ4ndhp0OVzf3xG5W0GDKnNHEumjQcPIV5Bm2-Cp_xrUWzvuq7wj3pqztMMswKKbk2NxnB7n97wC-XwOy9uyk-7X2QIJSx5v8araZV6p8JsEeBmPMnmm3h1-B38qcOmsuNdE7jIon2rljJJBvUNhHVkJdoP2sdB8rXjk7dN4x_oqE_rUVVgyYd5Kk7Rew"}');
});

installMain(app);

installHomes(app);

installUsers(app);

installUserEdit(app);

installInbox(app);

installAdmin(app);


app.use('/search',searchRouter);

app.use('/manage-home',manageHomeRouter);

http.createServer(app).listen(3000);
