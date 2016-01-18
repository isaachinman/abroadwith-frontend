var express = require('express');
var basicAuth = require('basic-auth-connect');
var http = require('http');
var nunjucks = require('nunjucks');
var fs = require('fs');
var searchRouter = require('./search/Router');
var mainRouter = require('./main/Router');
var languages = require('./utils/Translations')

var app = express();

var options = {
  key: fs.readFileSync('test-key.pem'),
  cert: fs.readFileSync('test-cert.pem')
};

nunjucks.configure('src',{watch:true});

app.use(express.static('build'));

app.use('/*', function (req, res, next) {
  var prefix = req.hostname.substring(0,2);
  var value = languages.iso[prefix];

  if(value) {
    req.language = value;
    console.log("Called for language "+value);
  }
  else{
    req.language = "eng";
  }
  next();
});

app.use(['/home','/'],mainRouter);

app.get('/homes/*', function (req, res) {
  res.send(nunjucks.render('homes/homes.html'));
});

app.use('/search',searchRouter);

http.createServer(app).listen(3000);
