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

      this.props.results.forEach(function(obj) {
        var result = <IndividualResult
              key={obj.roomId}
              markerId={markerId}
              immersions={obj.immersions}
              price={obj.price}
              roomPhoto={obj.roomPhoto}
              homePhotos={obj.homePhotos}
              host={obj.hostName}
              homeType={obj.homeType}
              reviewCount={obj.reviewCount}
              rating={obj.rating}
              hostPhoto={obj.hostPhoto}
              courseCount={obj.nearbySchools}
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
