var React = require('react');
var Dates = require('./search-dates.react');
var Language = require('./search-language.react');
var Price = require('./search-price.react');
var LanguageCourse = require('./search-language-course.react');
var Tandem = require('./search-tandem.react');
var MoreFilters = require('./search-more-filters.react');


module.exports = React.createClass({
  getInitialState: function(){
    return {
      // State will be populated by POST
    }
  },
  handleClick: function(){
    this.setState({
      minPrice: 900
    });
  },
  handleChange: function() {

    // Get map data
    var bounds = bigMap.getBounds();
    var NE;
    var SW;
    bounds !== undefined ? SW = (bounds.getNorthEast()) : null;
    bounds !== undefined ? NE = (bounds.getSouthWest()) : null;

    this.setState({
      arrival: document.getElementById('arrival').value,
      departure: document.getElementById('departure').value,
      guests: document.getElementById('guests').value,
      language: document.getElementById('language').value,
      immersion: $('#immersion').val(),
      course: $('#language-switch').is(':checked') ? $('#language-school').val() : null,
      specialPrefs: $('#special-prefs').val(),
      mealPlan: $('#meal-plan').val(),
      mealPref: $('#meal-pref').val(),
      dietRestrictions: $('#diet-restrictions').val(),
      ammenities: $('#ammenities').val(),
      houseType: $('#house-type').val(),
      minLat: SW !== undefined ? SW.lat() : null,
      minLng: SW !== undefined ? SW.lng() : null,
      maxLat: NE !== undefined ? NE.lat() : null,
      maxLng: NE !== undefined ? NE.lng() : null
    })
  },
  componentDidMount: function() {

    var activeNodes = [
      $('#arrival'),
      $('#departure'),
      $('#guests'),
      $('#language'),
      $('#immersion'),
      $('#language-switch'),
      $('#special-prefs'),
      $('#meal-plan'),
      $('#meal-pref'),
      $('#diet-restrictions'),
      $('#ammenities'),
      $('#house-type')
    ];

    var handleChange = this.handleChange;

    for (var i=0; i<activeNodes.length; i++) {
      activeNodes[i].change(handleChange);
    }

    $.post(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      var newState = {
        // Set initial state vars
        minPrice:         response.resultDetails.minPrice,
        maxPrice:         response.resultDetails.maxPrice,
        numberOfResults:  response.resultDetails.numberOfResults,
        currency:         response.params.currency,
        immersion:        response.params.immersion,
        arrival:          response.params.arrival,
        departure:        response.params.departure,
        minLat:           response.params.location.minLat,
        minLng:           response.params.location.minLng,
        maxLat:           response.params.location.maxLat,
        maxLng:           response.params.location.maxLng,
        guests:           response.params.guests,
        language:         response.params.language,
        tandem:           response.params.offeredLanguages ? response.params.offeredLanguages : null,
        course:           response.params.languageCourse ? response.params.languageCourse.level : null,
        extras:           response.params.filters.extras,
        specialPrefs:     response.params.filters.specialPrefs,
        mealPlan:         response.params.filters.mealPlan,
        mealPref:         response.params.filters.mealPref,
        dietRestrictions: response.params.filters.dietRestrictions,
        ammenities:       response.params.filters.ammenities,
        houseType:        response.params.houseType
      }

      if (this.isMounted()) {
        this.setState(newState);
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        Min price: {this.state.minPrice} /

        Max price: {this.state.maxPrice} /

        Num of results: {this.state.numberOfResults} /

        Currency: {this.state.currency} /

        Immersion: {this.state.immersion} /

        Arrival: {this.state.arrival} /

        Departure: {this.state.departure} /

        MinLat: {this.state.minLat} /
        MinLng: {this.state.minLng} /
        MaxLat: {this.state.maxLat} /
        MaxLng: {this.state.maxLng} /

        Latitude: {this.state.latitude} /

        Longitude: {this.state.longitude} /

        Guests: {this.state.guests} /

        House Type: {this.state.houseType} /

        Language: {this.state.language} /

        Course: {this.state.course} /

        Filters: {this.state.filters} /

        Special Prefs: {this.state.specialPrefs} /

        Meal Plan: {this.state.mealPlan} /

        Meal Pref: {this.state.mealPref} /

        Diet Restrictions: {this.state.dietRestrictions} /

        Ammenities: {this.state.ammenities} /

        House Type: {this.state.houseType} /

        <div className='container'>

          <Dates
            arrival={this.state.arrival}
            departure={this.state.departure}
            guests={this.state.guests}
            handleChange={this.handleChange}
          />

          <div className='divider'></div>

          <Language
            language={this.state.language}
            immersion={this.state.immersion}
          />

          <div className='divider tandem-language hide'></div>

          <Tandem
            tandem={this.state.tandem}
          />

          <div className='divider'></div>

          <Price
            minPrice={this.state.minPrice}
            maxPrice={this.state.maxPrice}
            handleChange={this.handleChange}
          />

          <div className='divider'></div>

          <LanguageCourse
            course={this.state.course}
          />

        </div>

        <MoreFilters
          specialPrefs={this.state.specialPrefs}
          mealPlan={this.state.mealPlan}
          mealPref={this.state.mealPref}
          dietRestrictions={this.state.dietRestrictions}
          amenities={this.state.amenities}
          houseType={this.state.houseType}
        />

      </div>
    );
  }
});
