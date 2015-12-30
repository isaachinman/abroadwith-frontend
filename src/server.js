var express = require('express');
var basicAuth = require('basic-auth-connect');
var http = require('http');
var nunjucks = require('nunjucks');
var fs = require('fs');
var searchRouter = require('./search/Router');
var mainRouter = require('./main/Router');

var app = express();

nunjucks.configure('src',{watch:true});

app.use(express.static('build'));

app.param('language', function (req, res, next, value) {
  console.log("Called for language "+value);
  //TODO validate language.
  if(value) req.language = value;
  next();
});

app.get('/', function (req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + "/home" });
  res.end();
});

app.use(['/home','/:language/home'],mainRouter);

app.get(['/homes/*','/:language/homes/*'], function (req, res) {
  res.send(nunjucks.render('homes/homes.html'));
});

app.use(['/search','/:language/search'],searchRouter);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
