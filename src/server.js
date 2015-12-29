var express = require('express');
var basicAuth = require('basic-auth-connect');
var http = require('http');
var https = require('https');
var nunjucks = require('nunjucks');
var fs = require('fs');
var searchRouter = require('./search/Router');

var options = {
  key: fs.readFileSync('test-key.pem'),
  cert: fs.readFileSync('test-cert.pem')
};

var app = express();

nunjucks.configure('src',{watch:true});

app.use(basicAuth('abroadwith', 'betahaus'));

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

app.get(['/home','/:language/home'], function (req, res) {
  res.send(nunjucks.render('index/index.html'));
});

app.get(['/homes/*','/:language/homes/*'], function (req, res) {
  res.send(nunjucks.render('homes/homes.html'));
});

app.use(['/search','/:language/search'],searchRouter);

// Create an HTTP service.
// Redirect from http port to https
http.createServer(function (req, res) {
    console.log(new Date().toISOString()+": Redirect -- "+"https://" + req.headers['host'].replace("8080","8443") + req.url);
    res.writeHead(301, { "Location": "https://" + req.headers['host'].replace("8080","8443") + req.url });
    res.end();
}).listen(8080);

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(8443);
