var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      minPrice: ''
    }
  },
  componentDidMount: function() {
    $.get(this.state.source, function(response) {
      var _minPrice = response.resultDetails.minPrice;
      if (this.isMounted()) {
        this.setState({
          minPrice: _minPrice
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

      </div>
    );
  }
});
