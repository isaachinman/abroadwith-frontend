var fs = require('fs');
var https = require('https');
var currencyRates;

// Update currencies every six hours
var updateTime = 1000*60*60*6

// Function to write currencies to an external json file
var writeCurrencies = function(content) {
  fs.writeFile("rates.json", JSON.stringify(content) , function(err) {
    if (err) {
      console.log(err)
    }
  })
}

// Function to load back previously saved currencies
var loadCurrencies = function() {

  try {
    if (!currencyRates) {
      currencyRates = require("../../../rates.json")
    }
  }

  catch(e) {
    currencyRates = {timestamp:0}
  }

  // If currency rate timestamp is old enough, get new data
  if (currencyRates.timestamp*1000 < (new Date().getTime() - updateTime)) {

    https.get('https://openexchangerates.org/api/latest.json?app_id=dd1c917afe9e48e5860f6a913ed0e227', function (response) {

      // Set up an empty string to add to
      var body = ''

      // Add response data
      response.on('data', function(d) {
        body += d
      })

      response.on('end', function() {

        // Parse data
        currencyRates = JSON.parse(body)

        // Write to file
        writeCurrencies(currencyRates)

      })
    }).on('error', function(e) {
      console.log(e)
    })
  }
}

loadCurrencies()

module.exports = function(value, from, to){

  // Use euros as default from currency
  if (!from) {
    from = 'EUR'
  }

  // Use euros as default to currency
  if (!to) {
    to = 'EUR'
  }

  // Load currencies from external file
  loadCurrencies()

  // Calculate new price
  var toNewCurrency = value/currencyRates.rates[from]
  return Math.ceil(toNewCurrency*currencyRates.rates[to])

}
