var React = require('react');
var Test = require('./search-node-test.react');

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
  componentDidMount: function() {
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

        <Test
          minPrice= {this.state.minPrice}
        />

        <input type="submit" onClick={this.handleClick} />

      </div>
    );
  }
});
