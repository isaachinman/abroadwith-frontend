var React = require('react');
var Dates = require('./search-dates.react');
var Language = require('./search-language.react');

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
    this.setState({
      arrival: document.getElementById('arrival').value,
      departure: document.getElementById('departure').value,
      guests: document.getElementById('guests').value,
      language: document.getElementById('language').value,
      immersion: $('#immersion').val()
    })
  },
  componentDidMount: function() {

    $('#arrival').change(this.handleChange);
    $('#departure').change(this.handleChange);
    $('#guests').change(this.handleChange);
    $('#language').change(this.handleChange);
    $('#immersion').change(this.handleChange);

    $.post(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      if (this.isMounted()) {
        this.setState({

          // Set initial state vars
          minPrice:         response.resultDetails.minPrice,
          maxPrice:         response.resultDetails.maxPrice,
          numberOfResults:  response.resultDetails.numberOfResults,
          currency:         response.params.currency,
          immersion:        response.params.immersion,
          arrival:          response.params.arrival,
          departure:        response.params.departure,
          latitude:         response.params.location.lat,
          longitude:        response.params.location.lng,
          guests:           response.params.guests,
          houseType:        response.params.houseType,
          language:         response.params.language,
          course:           response.params.languageCourse.level,
          filters:          response.params.filters

        });
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

        Latitude: {this.state.latitude} /

        Longitude: {this.state.longitude} /

        Guests: {this.state.guests} /

        House Type: {this.state.houseType} /

        Language: {this.state.language} /

        Course: {this.state.languageCourse} /

        Filters: {this.state.filters}

        <Dates
          arrival={this.state.arrival}
          departure={this.state.departure}
          guests={this.state.guests}
          handleChange={this.handleChange}
        />

      <Language
        language={this.state.language}
        immersion={this.state.immersion}
      />

      </div>
    );
  }
});
