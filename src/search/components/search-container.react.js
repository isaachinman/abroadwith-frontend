var React =           require('react')
var Language =        require('./search-language.react')
var Price =           require('./search-price.react')
var LanguageCourse =  require('./search-language-course.react')
var Tandem =          require('./search-tandem.react')
var MoreFilters =     require('./search-more-filters.react')
var Results =         require('./search-results.react')
var Pagination =      require('./search-pagination.react')
var Map =             require('./search-map.react')

var i18n = require('../../global/util/i18n')
var apiDate = require('api-date')

module.exports = React.createClass({
  handleChange: function(predeterminedQuery, activePage) {

    // Get map data
    if (typeof bigMap !== 'undefined') {
      var bounds = bigMap.getBounds()
      var SW, NE
      bounds !== undefined ? SW = (bounds.getNorthEast()) : null
      bounds !== undefined ? NE = (bounds.getSouthWest()) : null
    }

    if (predeterminedQuery !== undefined && typeof predeterminedQuery === 'string') {
      var url = predeterminedQuery

      // Do pagination stuff
      if (url.indexOf('pageSize') === -1) {
        url = url + '&pageSize=10'
      }
      if (url.indexOf('pageOffset') === -1) {
        if (activePage !== undefined) {
          url = url + '&pageOffset=' + ((activePage*10))
        } else {
          url = url + '&pageOffset=0'
        }
      }

    } else {

      var simpleValues = [
        $('#arrival'),
        $('#departure'),
        $('#guests'),
        $('#language'),
        $('#immersions'),
        $('#specialPrefs'),
        $('#mealPlan'),
        $('#mealPref'),
        $('#dietRestrictions'),
        $('#amenities'),
        $('#houseType'),
      ]

      var url = '?'
      var counter = 0

      // Push values into search string
      for (var i=0; i<simpleValues.length; i++) {
        var val = simpleValues[i].val();
        if (val !== undefined && val !== null && val !== '') {
          counter++;
          if (counter===1) {
            var param = simpleValues[i].attr('id') + '=' + val;
          } else {
            var param = '&' + simpleValues[i].attr('id') + '=' + val;
          }
          url += param;
        }
      }

      // Get price data
      if ($('.noUi-handle-lower').length && $('.noUi-handle-upper').length) {
        var minPrice = parseInt(($('.noUi-handle-lower').find('.noUi-tooltip').html()));
        var maxPrice = parseInt($('.noUi-handle-upper').find('.noUi-tooltip').html());
        url = url + '&minPrice=' + minPrice + '&maxPrice=' + maxPrice;
      }

      // Get course
      var course = 'course=' + $('#language-switch').is(':checked') ? url = url + '&course=' + ($('#language-school').val()) : null;

      // Get currency
      var currency = 'currency=' + $('#ui-currency').val() !== '' && $('#ui-currency').val() !== null && $('#ui-currency').val() !== 'undefined' ? url = url + '&currency=' + $('#ui-currency').val() : null;

      // Do pagination stuff
      url = url + '&pageSize=10'
      if (activePage !== undefined) {
        url = url + '&pageOffset=' + (activePage*10)
      } else {
        url = url + '&pageOffset=0'
      }

    }

    // Do map stuff
    if (url.indexOf('minLat') === -1 && url.indexOf('minLng') === -1 && url.indexOf('maxLat') === -1 && url.indexOf('maxLng') === -1) {
      url += '&minLat=' + SW.lat()
      url += '&minLng=' + SW.lng()
      url += '&maxLat=' + NE.lat()
      url += '&maxLng=' + NE.lng()
    }

    $.post('/search'+url, function(data) {

      var response = JSON.parse(data);

      console.log(response)

      var newState = {
        // Set new state vars
        query:            url,
        minPrice:         response.resultDetails.minPrice,
        maxPrice:         response.resultDetails.maxPrice,
        currency:         response.params.currency,
        numberOfResults:  response.resultDetails.numberOfResults,
        pageSize:         response.params.pageSize,
        pageOffset:       response.params.pageOffset,
        immersions:       response.params.immersions !== undefined ? response.params.immersions : [],
        arrival:          response.params.arrival,
        departure:        response.params.departure,
        minLat:           response.params.location ? response.params.location.minLat : null,
        minLng:           response.params.location ? response.params.location.minLng : null,
        maxLat:           response.params.location ? response.params.location.maxLat : null,
        maxLng:           response.params.location ? response.params.location.maxLng : null,
        guests:           response.params.guests,
        language:         response.params.language,
        tandem:           response.params.offeredLanguages ? response.params.offeredLanguages : null,
        course:           response.params.languageCourse ? response.params.languageCourse.level : null,
        extras:           response.params.filters.extras ? response.params.filters.extras : null,
        specialPrefs:     response.params.filters.specialPrefs ? response.params.filters.specialPrefs: null,
        mealPlan:         response.params.filters.mealPlan ? response.params.filters.mealPlan: null,
        mealPref:         response.params.filters.mealPref ? response.params.filters.mealPref: null,
        dietRestrictions: response.params.filters.dietRestrictions ? response.params.filters.dietRestrictions : null,
        amenities:        response.params.filters.amenities ? response.params.filters.amenities : null,
        houseType:        response.params.filters.houseType ? response.params.filters.houseType : null,
        results:          response.results
      }

      this.setState(newState, function(){
        history.pushState(null, null, url)
      });

    }.bind(this))
  },
  componentDidUpdate: function() {
    // Refresh selects
    $('select.material').material_select();
  },
  componentDidMount: function() {

    // Send search event
    ga('send', 'event', 'user_events', 'search_performed')

    window.handleChange = this.handleChange

    $('select#language').change(function() {
      if ($(this).val() !== 'undefined' && $(this).val() !== '') {

        $('#language-switch').attr('disabled') ? $('#language-switch').removeAttr('disabled') : null;

        var language = $(this).val();
        $('select#language-school option').each(function() {
          $(this).html(i18n.t('languages:'+language) + ' ' + $(this).val());
        })

        $('select#language-school').material_select();
      }
    })

    // This is an array of nodes which will trigger handleChange
    var activeNodes = [
      $('#guests'),
      $('#language'),
      $('#immersions'),
      $('#language-switch'),
      $('#specialPrefs'),
      $('#mealPlan'),
      $('#mealPref'),
      $('#dietRestrictions'),
      $('#amenities'),
      $('#houseType'),
      $('#ui-currency')
    ]

    // Give all basic inputs a change function
    for (var i=0; i<activeNodes.length; i++) {
      activeNodes[i].off()
      activeNodes[i].change(handleChange)
    }

    // Use a blur function for dates to prevent double triggering
    $('#arrival, #departure').blur(function() {
      handleChange();
    })

  },
  render: function() {
    return (
      <div>

        <Language
          language={this.state.language}
          immersions={this.state.immersions}
        />

        <Tandem
          tandem={this.state.tandem}
        />

        <Price
          minPrice={this.state.minPrice}
          maxPrice={this.state.maxPrice}
          handleChange={this.handleChange}
          currency={this.state.currency}
        />

        <LanguageCourse
          course={this.state.course}
        />

        <MoreFilters
          specialPrefs={this.state.specialPrefs}
          mealPlan={this.state.mealPlan}
          mealPref={this.state.mealPref}
          dietRestrictions={this.state.dietRestrictions}
          amenities={this.state.amenities}
          houseType={this.state.houseType}
        />

        <Results
          currency={this.state.currency}
          results={this.state.results}
          query={this.state.query}
        />

        <Pagination
          numberOfResults={this.state.numberOfResults}
          pageSize={this.state.pageSize}
          pageOffset={this.state.pageOffset}
        />

        <Map
          currency={this.state.currency}
          results={this.state.results}
        />

      </div>
    );
  }
});
