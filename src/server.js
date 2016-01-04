var express = require('express');
var basicAuth = require('basic-auth-connect');
var http = require('http');
var https = require('https');
var nunjucks = require('nunjucks');
var fs = require('fs');
var searchRouter = require('./search/Router');
var mainRouter = require('./main/Router');

var app = express();

var options = {
  key: fs.readFileSync('test-key.pem'),
  cert: fs.readFileSync('test-cert.pem')
};

nunjucks.configure('src',{watch:true});

app.use(express.static('build'));

app.param('language', function (req, res, next, value) {
  console.log("Called for language "+value);
  //TODO validate language.
  if(value) req.language = value;
  next();
});

app.get('/', function (req, res) {
  res.writeHead(307, { "Location": "https://" + req.headers['host'].replace("3000","3443") + "/home" });
  res.end();
});

app.use(['/home','/:language/home'],mainRouter);

app.get(['/homes/*','/:language/homes/*'], function (req, res) {
  res.send(nunjucks.render('homes/homes.html'));
});

app.use(['/search','/:language/search'],searchRouter);

// Create an HTTP service.
// Redirect from http port to https
https.createServer(options, function (req, res) {
    console.log(new Date().toISOString()+": Redirect -- "+"http://" + req.headers['host'].replace("3443","3000") + req.url);
    res.writeHead(301, { "Location": "http://" + req.headers['host'].replace("3443","3000") + req.url });
    res.end();
}).listen(3443);

// Create an HTTPS service identical to the HTTP service.
http.createServer(app).listen(3000);
