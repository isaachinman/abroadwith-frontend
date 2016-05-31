const express = require('express')
const nunjucks = require('nunjucks')
const router = express.Router()
const winston = require('winston')
const http = require('http')
const settings = require('../ServerSettings')
const apiDate = require('../../src/utils/api-date')

router.get('/', function (req, res) {
  if(!req.context) res.status(404).send('No search context.')
  res.send(nunjucks.render('search/search.html',req.context))
})

router.post('/', function (req, res) {
  //TODO only respond if coming from our site, no external calls.
  var concat_params = []
  for (var param in req.query) {
    concat_params.push(param+"="+req.query[param])
  }

  var search_response = {}
  search_response.params= {}

  var options = JSON.parse(JSON.stringify(settings.solr))

  var query = []

  if (req.query.currency) {

    // If there is a currency in the query, use it
    search_response.params.currency = req.query.currency

  } else if (req.cookies && req.cookies['ui-currency']){

    // Otherwise if there is a currency cookie
    search_response.params.currency = req.cookies['ui-currency']

  } else {

    // Otherwise use euros
    search_response.params.currency = 'EUR'

  }

  // Set minPrice accordingly
  if (!req.query.minPrice) {
    req.query.minPrice = '*'
  } else {
    req.query.minPrice = req.query.minPrice+'.00,'+search_response.params.currency
  }

  // Set maxPrice accordingly
  if (!req.query.maxPrice) {
    req.query.maxPrice = '*'
  } else {
    req.query.maxPrice = req.query.maxPrice+'.00,'+search_response.params.currency
  }

  query.push('roomPrice:['+req.query.minPrice+' TO '+req.query.maxPrice+']')

  if (req.query.minLat && req.query.minLng && req.query.maxLat && req.query.maxLng) {

    // Set lat and lng params accordingly
    search_response.params.location = {}
    search_response.params.location.minLat = req.query.minLat
    search_response.params.location.minLng = req.query.minLng
    search_response.params.location.maxLat = req.query.maxLat
    search_response.params.location.maxLng = req.query.maxLng
    query.push('location:['+req.query.maxLat+','+req.query.maxLng+' TO '+req.query.minLat+','+req.query.minLng+']')

  } else {

    // If no location is set, go to Berlin.
    search_response.params.location = {}
    search_response.params.location.minLat = 52.704263293159194
    search_response.params.location.minLng = 13.594019836425787
    search_response.params.location.maxLat = 52.31938900224543
    search_response.params.location.maxLng = 13.154566711425787

  }

  if (req.query.immersions) {
    var all = req.query.immersions.split(',')
    search_response.params.immersions = all
    query.push('immersions:('+all.join(" ")+')')
  }

  if (req.query.arrival && req.query.departure) {
    search_response.params.arrival = req.query.arrival
    search_response.params.departure = req.query.departure
    query.push('-bookingDateRanges:[' + apiDate(req.query.arrival) + ' TO ' + apiDate(req.query.departure) + ']')
  }

  if (req.query.guests) {
    search_response.params.guests = parseInt(req.query.guests)
    query.push('roomVacancies:['+req.query.guests+' TO *]')
  }

  if (req.query.language) {
    search_response.params.language = req.query.language
    query.push('offeredLanguages:(' + req.query.language + ')')
  }

  // An object and array to keep track of filters
  var filters = []
  search_response.params.filters = {}

  var filterSections = [
    'specialPrefs',
    'mealPlan',
    'mealPref',
    'dietRestrictions',
    'amenities',
    'houseType'
  ]

  for (var i=0; i < filterSections.length; i++) {
    if (req.query[filterSections[i]]) {
      var all = req.query[filterSections[i]].split(',')
      search_response.params.filters[filterSections[i]] = all
      filters = filters.concat(all)
    }
  }

  if (req.query.neighbourhood) {
    var all = req.query.neighbourhood.split(',')
    search_response.params.filters.neighbourhood = all
    list = []
    for (var i = 0; i < all.length; i++) {
      filters.push(all[i])
    }
  }

  if (filters.length > 0) {
    query.push("filters:("+filters.join(" AND ")+")")
  }

  if (req.query.lnglvl) {
    search_response.params.languageCourse = {}
    search_response.params.languageCourse.level = req.query.lnglvl
    //TODO course search
  }

  if (req.query.pageOffset) {
    search_response.params.pageOffset = parseInt(req.query.pageOffset)
  } else {

    // If there is no page offset provided, set offset to zero
    search_response.params.pageOffset = 0
    req.query.pageOffset = 0

  }

  if (req.query.pageSize) {
    search_response.params.pageSize = parseInt(req.query.pageSize)
  } else {

    // If there is no page size provided, set page size to 25
    search_response.params.pageSize = 25
    req.query.pageSize = 25

  }

  winston.info("[Search Query]",query.join(" AND "))
  options.path += '?q='+encodeURIComponent(query.join(" AND "))+'&start='+req.query.pageOffset+'&rows='+req.query.pageSize+'&stats=true&wt=json&fl=*,price:currency(roomPrice,'+search_response.params.currency+')'

  console.log(decodeURIComponent(options.path))

  http.get(options, function(resp){

    var body = ''

    resp.on('data', function(chunk) {
      body += chunk
    })

    resp.on('end', function() {

      var solr_result = JSON.parse(body)

      search_response.resultDetails = {
        numberOfResults: 0,
        minPrice: 10000,
        maxPrice: 0
      }

      if (solr_result.response) {
        search_response.resultDetails.numberOfResults = solr_result.response.numFound
        search_response.results = solr_result.response.docs
        processResults(search_response)
      }

      winston.info("[Search Response]",search_response)
      res.send(JSON.stringify(search_response))

    })

  }).on("error", function(e) {
    console.log("Got error: " + e.message)
  })
})

var processResults = function(search_response) {

  //TODO move this stuff to Solr
  var results = search_response.results
  var stop = results.length

  if (search_response.params.pageOffset + search_response.params.pageSize < results.length) {
    stop = search_response.params.pageOffset + search_response.params.pageSize;
  }

  for (var i = 0; i < stop; i++) {

    // If a room is more expensive than current max price, raise the range to reflect its presence
    if (results[i].price > search_response.resultDetails.maxPrice) {
      search_response.resultDetails.maxPrice = results[i].price
    }

    // If a room is less expensive than current min price, lower the range to reflect its presence
    if (results[i].price < search_response.resultDetails.minPrice) {
      search_response.resultDetails.minPrice = results[i].price
    }

    var location = results[i].location.split(',')

    results[i].lat = parseFloat(location[0])
    results[i].lng = parseFloat(location[1])

    delete results[i].location

  }
}

module.exports = router
