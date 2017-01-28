/* eslint-disable */
// This is an older endpoint, originally written by Matheus, and
// later modifyed by Isaac to fit a new pricing model. It doesn't
// look pretty, but it's withstood the test of time

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

if (req.query.tandemLanguage) {
  search_response.params.tandemLanguage = req.query.tandemLanguage
  query.push('interestedLanguages:(' + req.query.tandemLanguage + ')')
}

// An object and array to keep track of filters
var filters = []
search_response.params.filters = {}

var filterSections = [
  'specialPrefs',
  'mealPlan',
  'mealPref',
  'dietRestrictions',
  'amenities'
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

if (req.query.houseType) {
  var all = req.query.houseType.split(',')
  search_response.params.filters.houseType = all
  query.push("homeType:("+(req.query.houseType.replace(/,/g, ' OR '))+')')
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

// -----------------------------------------------------
// Logic for which kind of price to fetch
// -----------------------------------------------------

// This object will be referenced throughout
GLOBAL.priceSchema = {
  SI: {
    regular: 'stayPrice',
    oneMonth: 'oneMonthStayPrice',
    threeMonth: 'threeMonthStayPrice',
    sixMonth: 'sixMonthStayPrice'
  },
  TA: {
    regular: 'tandemPrice',
    oneMonth: 'oneMonthTandemPrice',
    threeMonth: 'threeMonthTandemPrice',
    sixMonth: 'sixMonthTandemPrice'
  },
  TE: {
    regular: 'teacherPrice',
    oneMonth: 'oneMonthTeacherPrice',
    threeMonth: 'threeMonthTeacherPrice',
    sixMonth: 'sixMonthTeacherPrice'
  }
}

// There can be 1 to 12 possible price types to search for
global.priceTypes = []

if (req.query.immersions) {

  // Split immersions into an array so it's easier to handle
  GLOBAL.immersions = req.query.immersions.split(',')

// If the user hasn't specified an immersion, search for all three
} else {
  GLOBAL.immersions = [ 'SI', 'TA', 'TE' ]
}

// Get all basic price types for immersions being searched for
for (var i=0; i < immersions.length; i++) {
  priceTypes.push(priceSchema[immersions[i]].regular)
}

// If there is an arrival and departure date, we need to check
// it to see if the immersion qualifies for a time discount
if (req.query.arrival && req.query.departure) {

  var arrival = moment(req.query.arrival, 'DD-MM-YYYY')
  var departure = moment(req.query.departure, 'DD-MM-YYYY')
  var lengthOfImmersion = departure.diff(arrival, 'days')

  // If the immersion is at least 30 days long,
  // it qualifies for a one month discount
  if (lengthOfImmersion >= 30) {
    for (var i=0; i < immersions.length; i++) {
      priceTypes.push(priceSchema[immersions[i]].oneMonth)
    }
  }

  // If the immersion is at least 90 days long,
  // it qualifies for a three month discount
  if (lengthOfImmersion >= 90) {
    for (var i=0; i < immersions.length; i++) {
      priceTypes.push(priceSchema[immersions[i]].threeMonth)
    }
  }

  // If the immersion is at least 180 days long,
  // it qualifies for a six month discount
  if (lengthOfImmersion >= 180) {
    for (var i=0; i < immersions.length; i++) {
      priceTypes.push(priceSchema[immersions[i]].sixMonth)
    }
  }

}

// Now push ranges for all priceTypes into query
var priceRanges = []
for (var i=0; i < priceTypes.length; i++) {
  priceRanges.push(priceTypes[i] + ':[' + req.query.minPrice + ' TO ' + req.query.maxPrice + ']')
}

// Set up query and encode it
winston.info("[Search Query]",query.join(" AND "))
options.path = '/solr/abroadwith_rooms/select?q=' + encodeURIComponent(query.join(" AND ")) + encodeURIComponent(' AND (' + priceRanges.join(' OR ')) + ')&start='+req.query.pageOffset+'&rows='+req.query.pageSize+'&stats=true&wt=json&fl=*,'


// Now push currency for all priceTypes into query
for (var i=0; i < priceTypes.length; i++) {
  options.path += priceTypes[i] + ':currency(' + priceTypes[i] + ',' + search_response.params.currency + '),'
}

// Sort results based on proprietary ranking value
options.path += '&sort=homeRating+DESC'


console.log('Path searched:', decodeURIComponent(options.path))


// -----------------------------------------------------
// End of price fetch logic
// -----------------------------------------------------

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
