var https = require('https');
var domains= require('../global/constants/domains');

var transformToStars = function(user){
  var rating = (Math.round(user.rating * 2) / 2).toFixed(1);
  var stars = [];

  var starRemainder = Math.floor(5 - rating);

  while (rating > 0) {
    if (rating >= 1) {
  	   stars.push('<i class="fa fa-star" > </i>')
    }
    else if (rating == 0.5) {
  	   stars.push('<i class="fa fa-star-half-o" > </i>')
    }
    rating--;
  }

  while (starRemainder > 0) {
    stars.push('<i class="fa fa-star-o" > </i>')
    starRemainder--;
  }
  return stars.join('');
}

module.exports = function (req, res, next, value) {
  if(!req.context) req.context = {};
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Not a proper user id.');
    return;
  }

  https.get(domains.API + "/public/users/"+value,
    function (response) {
      var body = '';
      if(response.statusCode == 404){
        res.status(404).send('User not found.');
        return;
      }
      if(response.statusCode != 200){
        res.status(response.statusCode).send('Unexpected response.');
        return;
      }
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
          var parsed = JSON.parse(body);
          req.context.user = parsed;
          req.context.user.id = value; //TODO make sure it is in the return object.
          if(req.context.user.rating){
            req.context.user.ratingHTML = transformToStars(req.context.user);
          }
          if(req.context.user.hasVisited){
            req.context.user.hasVisited = JSON.parse(req.context.user.hasVisited);
          }
          if(req.context.user.hasLived){
            req.context.user.hasLived = JSON.parse(req.context.user.hasLived);
          }
          next();
      });
  }).on('error', function(e) {
    console.log(e);
    res.status(500).send("Can't connect to API.");
  });
}
