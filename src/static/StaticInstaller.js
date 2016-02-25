var express = require('express');
var nunjucks = require('nunjucks');

var genericRouter = function(file){
  var router = express.Router();

  router.get('/', function (req, res) {
    if(!req.context) res.status(404).send('No text context.');
    res.send(nunjucks.render(file,req.context));
  });

  return router;
}

var installer = function(app) {
  app.use('/terms',genericRouter('static/terms.html'));
  app.use('/login',genericRouter('static/login.html'));
};

module.exports = installer;
