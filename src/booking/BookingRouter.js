var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No booking context.');
  if(!req.context.query.arrival ||!req.context.query.departure || !req.context.query.room_id  ){
    res.redirect("/homestay/"+req.context.home.id);
  }
  req.context.debug = JSON.stringify(req.context.home);
  res.send(nunjucks.render('booking/booking.html',req.context));
});

module.exports = router;
