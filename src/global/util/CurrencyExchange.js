var fs = require('fs');
var https = require('https');
var currencyRates;

var updateTime = 1000*60*60*6 //6 hours

var writeCurrencies = function(content){
  fs.writeFile("rates.json", JSON.stringify(content) , function(err) {
      if(err) {
        console.log(err)
      }
  });
}

var loadCurrencies = function(){
  try{
    if(!currencyRates) currencyRates = require("../../../rates.json");
  }
  catch(e){
    currencyRates = {timestamp:0}
    console.log(e);
  }
  if(currencyRates.timestamp*1000 < (new Date().getTime() - updateTime)){
    console.log(currencyRates.timestamp*1000,(new Date().getTime() - updateTime));
    https.get('https://www.openexchangerates.org/api/latest.json?app_id=dd1c917afe9e48e5860f6a913ed0e227',
      function (response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            currencyRates = JSON.parse(body);
            writeCurrencies(currencyRates);
        });
    }).on('error', function(e) {
      console.log(e);
    });
  }
}

loadCurrencies();

module.exports = function(value,from,to){
  if(!from) from = 'EUR';
  if(!to) to = 'EUR';
  loadCurrencies();
  var toUSD = value/currencyRates.rates[from];
  return Math.ceil(toUSD*currencyRates.rates[to]);
}
