var express = require('express');
var nunjucks = require('nunjucks');
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

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
