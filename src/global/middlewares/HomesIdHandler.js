var https = require('https');
var domains = require('../../global/constants/domains');
var currency = require('../../global/util/CurrencyExchange');

module.exports = function (req, res, next, value) {
  if(!req.context) req.context = {};
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Not a proper home id.');
    return;
  }
  https.get(domains.API + "/public/homes/"+value,
    function (response) {
      var body = '';
      if(response.statusCode == 404){
        res.status(404).send('Home not found.');
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
          req.context.home = parsed;
          req.context.home.id = value; //TODO make sure it is in the return object.
          for(var i = 0; i < req.context.home.rooms.length; i++){
            req.context.home.rooms[i].price = currency(req.context.home.rooms[i].price,req.context.home.currency,req.context.currency);
          }
          req.context.home.immersions.teacher.hourly = currency(req.context.home.immersions.teacher.hourly,req.context.home.currency,req.context.currency);
          
          req.context.debug = JSON.stringify(req.context.home);
          next();
      });
  }).on('error', function(e) {
    console.log(e);
    res.status(500).send("Can't connect to API.");
  });
}
