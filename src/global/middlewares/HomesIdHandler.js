var https = require('https');
var domains= require('../constants/domains');

module.exports = function (req, res, next, value) {
  if(!req.context) req.context = {};
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Not a proper home id.');
    return;
  }

    https.get(domains.API + "/users/320/homes/"+value+"/public",
    function (response) {
      var body = '';
      if(response.statusCode == 404){
        res.status(404).send('Home not found.');
        return;
      }
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
          var parsed = JSON.parse(body);
          req.context.home = parsed;
          req.context.home.id = value; //TODO make sure it is in the return object.
          req.context.debug = JSON.stringify(req.context.home);
          next();
      });
  }).on('error', function(e) {
    console.log(e);
    res.status(500).send("Can't connect to API.");
  });
}
