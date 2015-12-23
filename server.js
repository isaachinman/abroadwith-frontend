var express = require('express');
var nunjucks = require('nunjucks');
var app = express();

nunjucks.configure('templates');

app.use(express.static('build'));

app.get('/index.html', function (req, res) {
  res.send(nunjucks.render('index.html'));
});

app.get('/alternate.html', function (req, res) {
  res.send(nunjucks.render('alternate.html'));
});

app.get('/search.html', function (req, res) {
  res.send(nunjucks.render('search.html'));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
