var https = require('https');
var domains = require('../../global/constants/domains');
var currency = require('../../global/util/CurrencyExchange');

module.exports = function (req, res, next, value) {
  if(!req.context) req.context = {};
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    next('Not a proper home id.');
    return;
  }
  https.get(domains.API + "/public/homes/"+value,
    function (response) {
      var body = '';
      if(response.statusCode == 404){
        next('Home not found.');
        return;
      }
      if(response.statusCode != 200){
        next('Unexpected response.');
        return;
      }
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
          var parsed = JSON.parse(body);
          req.context.home = parsed;
          req.context.home.id = value; //TODO make sure it is in the return object.
          if(req.context.home.isActive == false){
            next('Home is not active.');
            return;
          }
          for(var i = 0; i < req.context.home.rooms.length; i++){
            req.context.home.rooms[i].price = currency(req.context.home.rooms[i].price,req.context.home.pricing.currency,req.context.currency);
          }
          if(req.context.home.immersions && req.context.home.immersions.teacher && req.context.home.immersions.teacher.hourly){
            req.context.home.immersions.teacher.hourly = currency(req.context.home.immersions.teacher.hourly,req.context.home.pricing.currency,req.context.currency);
          }
          req.context.debug = JSON.stringify(req.context.home);
          next();
      });
  }).on('error', function(e) {
    next("Can't connect to API. Error: " + e);
  });
}
