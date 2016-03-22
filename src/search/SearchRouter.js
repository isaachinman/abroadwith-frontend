var express = require('express');
var nunjucks = require('nunjucks');

var router = express.Router();

var http = require('http');

var solr = {
  host: 'ec2-52-29-86-131.eu-central-1.compute.amazonaws.com',
  port: 8983,
  path: '/solr/Search/select'
};

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No search context.');
  res.send(nunjucks.render('search/search.html',req.context));
});

router.post('/', function (req, res) {
  //TODO only respond if comming from our site, no external calls.
  var concat_params = [];
  for(var param in req.query){
    concat_params.push(param+"="+req.query[param]);
  }

  var search_response = {};
  search_response.params={};

  var options = JSON.parse(JSON.stringify(solr));

  var query = [];

  if(req.query.currency){
    search_response.params.currency = req.query.currency;
  }
  else{
    if(req.cookies && req.cookies['ui-currency']){
      search_response.params.currency = req.cookies['ui-currency'];
    }
    else{
      search_response.params.currency = 'EUR';
    }
  }

  if(!req.query.minPrice) req.query.minPrice = '*';
    else req.query.minPrice = req.query.minPrice+'.00,'+search_response.params.currency;
  if(!req.query.maxPrice) req.query.maxPrice = '*';
    else req.query.maxPrice = req.query.maxPrice+'.00,'+search_response.params.currency;

  query.push('roomPrice:['+req.query.minPrice+' TO '+req.query.maxPrice+']')

  if(req.query.minLat && req.query.minLng && req.query.maxLat && req.query.maxLng){
    search_response.params.location = {};
    search_response.params.location.minLat = req.query.minLat;
    search_response.params.location.minLng = req.query.minLng;
    search_response.params.location.maxLat = req.query.maxLat;
    search_response.params.location.maxLng = req.query.maxLng;
    query.push('location:['+req.query.maxLat+','+req.query.maxLng+' TO '+req.query.minLat+','+req.query.minLng+']');
  }
  else{
    //No location set, go to Berlin.
    search_response.params.location = {};
    search_response.params.location.minLat = 52.704263293159194;
    search_response.params.location.minLng = 13.594019836425787;
    search_response.params.location.maxLat = 52.31938900224543;
    search_response.params.location.maxLng = 13.154566711425787;
  }

  if(req.query.immersions){
    var all = req.query.immersions.split(',');
    search_response.params.immersions = all;
    query.push('immersions:('+all.join(" ")+')');
  }
  else {
    search_response.params.immersions = ["stay", "teacher", "tandem"]
    query.push('immersions:('+search_response.params.immersions.join(" ")+')');
  }

  if(req.query.arrival){
    search_response.params.arrival = req.query.arrival;
    //TODO date search
  }

  if(req.query.departure){
    search_response.params.departure = req.query.departure;
    //TODO date search
  }

  if(req.query.guests){
    search_response.params.guests = req.query.guests;
    query.push('roomVacancies:['+req.query.guests+' TO *]');
  }

  if(req.query.language){
    search_response.params.language = req.query.language;
    query.push('offeredLanguages:(' + req.query.language + ')');
  }

  var filters = [];
  search_response.params.filters = {};
  if(req.query.specialPrefs){
    var all = req.query.specialPrefs.split(',');
    search_response.params.filters.specialPrefs = all;
    list = []
    for(var i = 0; i < all.length; i++){
      filters.push(all[i]);
    }
  }

  if(req.query.mealPlan){
    var all = req.query.mealPlan.split(',');
    search_response.params.filters.mealPlan = all;
    list = []
    for(var i = 0; i < all.length; i++){
      filters.push(all[i]);
    }
  }

  if(req.query.mealPref){
    var all = req.query.mealPref.split(',');
    search_response.params.filters.mealPref = all;
    list = []
    for(var i = 0; i < all.length; i++){
      filters.push(all[i]);
    }
  }

  if(req.query.dietRestrictions){
    var all = req.query.dietRestrictions.split(',');
    search_response.params.filters.dietRestrictions = all;
    list = []
    for(var i = 0; i < all.length; i++){
      filters.push(all[i]);
    }
  }

  if(req.query.ammenities){
    var all = req.query.ammenities.split(',');
    search_response.params.filters.ammenities = all;
    list = []
    for(var i = 0; i < all.length; i++){
      filters.push(all[i]);
    }
  }

  if(req.query.houseType){
    var all = req.query.houseType.split(',');
    search_response.params.filters.houseType = all;
    list = []
    for(var i = 0; i < all.length; i++){
      filters.push(all[i]);
    }
  }

  if(req.query.neighbourhood){
    var all = req.query.neighbourhood.split(',');
    search_response.params.filters.neighbourhood = all;
    list = []
    for(var i = 0; i < all.length; i++){
      filters.push(all[i]);
    }
  }

  if(filters.length > 0){
    query.push("filters:("+filters.join(" ")+")");
  }

  if(req.query.lnglvl){
    search_response.params.languageCourse = {};
    search_response.params.languageCourse.level = req.query.lnglvl;
    //TODO course search
  }

  if(req.query.pageOffset){
    search_response.params.pageOffset = req.query.pageOffset;
  }
  else{
    search_response.params.pageOffset = 0;
  }

  if(req.query.pageSize){
    search_response.params.pageSize = req.query.pageSize;
  }
  else{
    search_response.params.pageSize = 25;
  }
  console.log(query.join(" AND "));
  options.path += '?q='+encodeURIComponent(query.join(" AND "))+'&stats=true&wt=json&fl=*,price:currency(roomPrice,'+search_response.params.currency+')';
  console.log(options.path);
  http.get(options, function(resp){
    var body = '';
    resp.on('data', function(chunk) {
      body += chunk;
    });
    resp.on('end', function() {
      var solr_result = JSON.parse(body);
      search_response.resultDetails = {
        numberOfResults: 0,
        minPrice: 10000,
        maxPrice: 0
      };
      if(solr_result.response){
        search_response.resultDetails.numberOfResults = solr_result.response.numFound;
        search_response.results = solr_result.response.docs;
        processResults(search_response);
      }
      res.send(JSON.stringify(search_response));
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
  });
});

var processResults = function(search_response){
  //TODO move this stuff to Solr
  var results = search_response.results;
  var stop = results.length;
  if(search_response.params.pageOffset + search_response.params.pageSize < stop){
    stop = search_response.params.pageOffset + search_response.params.pageSize;
  }
  for(var i = search_response.params.pageOffset; i < stop; i++){
    if(results[i].price > search_response.resultDetails.maxPrice){
      search_response.resultDetails.maxPrice = results[i].price;
    }
    if(results[i].price < search_response.resultDetails.minPrice){
      search_response.resultDetails.minPrice = results[i].price;
    }
    var location = results[i].location.split(',');
    results[i].lat = location[0];
    results[i].lng = location[1];
    //TODO remove location member from the object
  }
}

module.exports = router;
