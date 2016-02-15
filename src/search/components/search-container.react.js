var React =           require('react');
var Dates =           require('./search-dates.react')
var Language =        require('./search-language.react');
var Price =           require('./search-price.react');
var LanguageCourse =  require('./search-language-course.react');
var Tandem =          require('./search-tandem.react');
var MoreFilters =     require('./search-more-filters.react');
var Results =         require('./search-results.react');
var Pagination =      require('./search-pagination.react');
var Map =             require('./search-map.react');


module.exports = React.createClass({
  handleChange: function() {

    // Get map data
    if (typeof bigMap !== 'undefined') {
      var bounds = bigMap.getBounds();
      var SW, NE;
      bounds !== undefined ? SW = (bounds.getNorthEast()) : null;
      bounds !== undefined ? NE = (bounds.getSouthWest()) : null;
    }

    var simpleValues = [
      $('#arrival'),
      $('#departure'),
      $('#guests'),
      $('#language'),
      $('#immersions'),
      $('#special-prefs'),
      $('#meal-plan'),
      $('#meal-pref'),
      $('#diet-restrictions'),
      $('#amenities'),
      $('#house-type'),
    ]

    var url = '/search?';

    var counter = 0;

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
        url = url + param;
      }
    }

    // Get price data
    var minPrice = (($('.noUi-handle-lower').find('.noUi-tooltip').html()).substring(1));
    minPrice != undefined ? url = url + '&minPrice=' + minPrice : null;
    var maxPrice = ($('.noUi-handle-upper').find('.noUi-tooltip').html()).substring(1);
    maxPrice != undefined ? url = url + '&maxPrice=' + maxPrice : null;

    // Get course
    var course = 'course=' + $('#language-switch').is(':checked') ? url = url + '&course=' + ($('#language-school').val()) : null;

    // Get map bounds
    var minLat = SW !== undefined ? url = url + '&minLat=' + (SW.lat()) : null;
    var minLng = SW !== undefined ? url = url + '&minLng=' + (SW.lng()) : null;
    var maxLat = NE !== undefined ? url = url + '&maxLat=' + (NE.lat()) : null;
    var maxLng = NE !== undefined ? url = url + '&maxLng=' + (NE.lng()) : null;

    console.log(url)

    $.post(url, function(data) {
      var response = JSON.parse(data);

      var newState = {
        // Set new state vars
        minPrice:         response.resultDetails.minPrice,
        maxPrice:         response.resultDetails.maxPrice,
        numberOfResults:  response.resultDetails.numberOfResults,
        currency:         response.params.currency,
        immersions:       response.params.immersions,
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
        extras:           response.params.filters.extras,
        specialPrefs:     response.params.filters.specialPrefs,
        mealPlan:         response.params.filters.mealPlan,
        mealPref:         response.params.filters.mealPref,
        dietRestrictions: response.params.filters.dietRestrictions,
        amenities:        response.params.filters.amenities,
        houseType:        response.params.filters.houseType,
        results:          response.results
      }

      if (this.isMounted()) {
        this.setState(newState);
      };
    }.bind(this))
  },
  componentDidMount: function() {

    window.handleChange = this.handleChange;

    var activeNodes = [
      $('#arrival'),
      $('#departure'),
      $('#guests'),
      $('#language'),
      $('#immersions'),
      $('#language-switch'),
      $('#special-prefs'),
      $('#meal-plan'),
      $('#meal-pref'),
      $('#diet-restrictions'),
      $('#amenities'),
      $('#house-type')
    ];

    for (var i=0; i<activeNodes.length; i++) {
      activeNodes[i].change(handleChange);
    }

    handleChange();

  },
  render: function() {
    return (
      <div>

        <Dates
          arrival={this.state.arrival}
          departure={this.state.departure}
          guests={this.state.guests}
          handleChange={this.handleChange}
        />

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
          results={this.state.results}
        />

        <Pagination
          numberOfResults={this.state.numberOfResults}
          pageSize={this.state.pageSize}
          pageOffset={this.state.pageOffset}
        />

        <Map
          results={this.state.results}
        />

      </div>
    );
  }
});
