var React = require('react');
var IndividualResult = require('./search-individual-result.react');
var Wallop = require('wallop');

module.exports = React.createClass({
  componentDidMount: function() {
    if ($('.wallop').length) {
      $('.wallop').each(function() {
        if (!($(this).hasClass('init'))) {
          $(this).addClass('init');
          var wallopEl = this;
          var slider = new Wallop(wallopEl);
        }
      })
    }
  },
  render: function() {

    var results = [];

    if (this.props.results) {

      var markerId = 0;

      var currency = this.props.currency;
      var query = this.props.query;

      this.props.results.forEach(function(obj) {
        var result = <IndividualResult
          query={query}
          key={obj.roomId}
          homeId={obj.homeId}
          markerId={markerId}
          immersions={obj.immersions}
          price={Math.ceil(obj.price)}
          currency={currency}
          roomPhoto={obj.roomPhoto}
          homePhotos={obj.homePhotos}
          host={obj.hostName}
          homeType={obj.homeType}
          reviewCount={obj.reviewCount}
          rating={obj.rating}
          hostPhoto={obj.hostPhoto}
          courseCount={obj.nearbySchools}
          neighbourhood={obj.homeNeighbourhood}
        />;
        results.push(result);
        markerId++;
      })

    }

    return (

      <div id='results' className='row section white relative'>

        {results}

      </div>

    );
  }
});
