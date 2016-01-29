var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

var http = require('http');

var solr = {
  host: 'ec2-52-29-86-131.eu-central-1.compute.amazonaws.com',
  port: 8983,
  path: '/solr/Search/select'
};

router.get('/', function (req, res) {
  if(req.language && translations[req.language])
    context = { translations: translations[req.language]};
  else
    context = { translations: translations['eng']};
  res.send(nunjucks.render('search/search.html',context));
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
    search_response.params.currency = 'EUR';
  }

  if(req.query.minLat && req.query.minLng && req.query.maxLat && req.query.maxLng){
    search_response.params.location = {};
    search_response.params.location.minLat = req.query.minLat;
    search_response.params.location.minLng = req.query.minLng;
    search_response.params.location.maxLat = req.query.maxLat;
    search_response.params.location.maxLng = req.query.maxLng;
    query.push('location:['+req.query.maxLat+','+req.query.maxLng+' TO '+req.query.minLat+','+req.query.minLng+']');
  }

  if(req.query.immersion){
    var all = req.query.immersion.split(',');
    var list = []
    for(var i = 0; i < all.length; i++){
      list.push('"'+all[i]+'"');
    }
    query.push('immersions:('+list.join(" ")+')');
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
    search_response.params.departure = req.query.guests;
    //TODO capacity search
  }

  if(req.query.lang){
    search_response.params.lang = req.query.lang;
    query.push('homeLanguages:'+req.query.lang);
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
    query.push(filters.join(" "));
  }

  if(req.query.lnglvl){
    search_response.params.languageCourse = {};
    search_response.params.languageCourse.level = req.query.lnglvl;
    //TODO course search
  }

  options.path += '?q=+'+encodeURIComponent(query.join(" +"))+'&wt=json&fl=*,price:currency(roomPrice,'+search_response.params.currency+')';
  console.log(options.path);
  http.get(options, function(resp){
    var body = '';
    resp.on('data', function(chunk) {
      body += chunk;
    });
    resp.on('end', function() {
      var solr_result = JSON.parse(body);
      search_response.resultDetails = {
        numberOfResults: 0
      };
      if(solr_result.response){
        search_response.resultDetails.numberOfResults = solr_result.response.numFound;
        search_response.results = solr_result.response.docs;
      }
      console.log(JSON.stringify(search_response));
      res.send(JSON.stringify(search_response));
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
  });
});

module.exports = router;
