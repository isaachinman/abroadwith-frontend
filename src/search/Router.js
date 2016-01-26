var express = require('express');
var nunjucks = require('nunjucks');
var translations = require('../utils/Translations');

var router = express.Router();

router.get('/', function (req, res) {
  if(req.language && translations[req.language])
    context = { translations: translations[req.language]};
  else
    context = { translations: translations['eng']};
  res.send(nunjucks.render('search/search.html',context));
});

router.post('/', function (req, res) {
  var concat_params = [];
  for(var param in req.query){
    concat_params.push(param+"="+req.query[param]);
  }

  var search_results = {};
  search_results.params={};

  if(concat_params.length > 0){
    console.log('../../mockups/search/'+concat_params.join("&")+".json");
    try{
      search_results = require('../../mockups/search/'+concat_params.join("&")+'.json');
    }
    catch(e){
      search_results = require('../../mockups/search/default.json');
    }
    search_results.params = req.query;
  }
  else{
    search_results = require('../../mockups/search/default.json');
  }

  if(req.query.lat && req.query.lon){
    search_results.params.location = {};
    search_results.params.location.latitude = req.query.lat;
    search_results.params.location.longitude = req.query.lon;
  }

  if(req.query.lnglvl){
    search_results.params.languageCourse = {};
    search_results.params.languageCourse.level = req.query.lnglvl;
  }

  res.send(JSON.stringify(search_results));
});

module.exports = router;
