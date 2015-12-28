var express = require('express');
var http = require('http');
var https = require('https');
var nunjucks = require('nunjucks');
var fs = require('fs');

var options = {
  key: fs.readFileSync('test-key.pem'),
  cert: fs.readFileSync('test-cert.pem')
};

var app = express();

nunjucks.configure('src',{watch:true});

app.use(express.static('build'));

app.get('/', function (req, res) {
  res.send(nunjucks.render('index/index.html'));
});

app.get('/homes/*', function (req, res) {
  res.send(nunjucks.render('homes/homes.html'));
});

app.get('/search.html', function (req, res) {
  res.send(nunjucks.render('search/search.html'));
});

// Create an HTTP service.
// Redirect from http port to https
http.createServer(function (req, res) {
    console.log("Crap -- "+"https://" + req.headers['host'].replace("8080","8443") + req.url);
    res.writeHead(301, { "Location": "https://" + req.headers['host'].replace("8080","8443") + req.url });
    res.end();
}).listen(8080);

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(8443);
