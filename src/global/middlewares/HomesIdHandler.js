var https = require('https');
var domains = require('../../global/constants/domains');
var currency = require('../../global/util/CurrencyExchange');

module.exports = function (req, res, next, value) {

  // If there is no context, create an empty context object
  if (!req.context) {
    req.context = {}
  }

  // Do some validation on homeId
  if (isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))) {
    next('Not a proper home id.')
    return
  }

  // Perform a GET request for this home
  https.get(domains.API + "/public/homes/" + value,
    function (response) {

      // Set up an empty string to add
      var body = '';

      // If response is a 404, report as such
      if (response.statusCode == 404) {
        next('Home not found.')
        return
      }

      // If response isn't a success, stop here
      if (response.statusCode != 200) {
        next('Unexpected response.')
        return
      }

      response.on('data', function(d) {
        body += d
      })

      response.on('end', function() {

        // Parse the response
        req.context.home = JSON.parse(body)

        // Double check that the home id was indeed the home returned
        if (parseInt(value) !== req.context.home.id) {
          return
        }

        // Check that home is indeed active
        if(req.context.home.isActive == false){
          next('Home is not active.')
          return
        }

        // Do some date parsing, and account for zero indexed months
        var joined = new Date(Date.parse(req.context.home.host.joinedDate))
        req.context.home.host.joinedMonth = (joined.getMonth() + 1)
        req.context.home.host.joinedYear = joined.getFullYear()

        // Loop through rooms and calculate prices based on current currency
        for (var i=0; i<req.context.home.rooms.length; i++) {
          req.context.home.rooms[i].price = currency(req.context.home.rooms[i].price,req.context.home.pricing.currency,req.context.currency)
        }

        // If host has a teacher immersion, calcuate that price too
        if (req.context.home.immersions && req.context.home.immersions.teacher && req.context.home.immersions.teacher.hourly) {
          req.context.home.immersions.teacher.hourly = currency(req.context.home.immersions.teacher.hourly,req.context.home.pricing.currency,req.context.currency)
        }

        // Stringify the context
        req.context.debug = JSON.stringify(req.context.home)
        next()

      })
  }).on('error', function(e) {
    next("Can't connect to API. Error: " + e)
  })
}
