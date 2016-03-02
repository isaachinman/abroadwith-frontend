var https = require('https');

module.exports = function (req, res, next, value) {
  if(!req.context) req.context = {};
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Not a proper home id.');
    return;
  }

  https.get("https://admin.abroadwith.com/users/317/homes/"+value+"/public",
    function (response) {
      var body = '';
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {

          // Data reception is done, do whatever with it!
          var parsed = JSON.parse(body);
          req.context.home = parsed;
          next();
      });
  }).on('error', function(e) {
    res.status(404).send('Home not found.');
    return;
  });
}
