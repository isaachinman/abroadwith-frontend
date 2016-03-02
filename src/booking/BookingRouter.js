var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No booking context.');
  req.context.debug = JSON.stringify(req.context);
  res.send(nunjucks.render('booking/booking.html',req.context));
});

module.exports = router;
