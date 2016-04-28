var React = require('react');
var IndividualResult = require('./search-individual-result.react');
var Wallop = require('wallop');

module.exports = React.createClass({
  componentDidUpdate: function() {
    if ($('.wallop').length) {
      $('.wallop').each(function() {
        if (!($(this).hasClass('init'))) {
          $(this).addClass('init');
          var wallopEl = this;
          var slider = new Wallop(wallopEl);
          slider.on('change', function(event) {
            var activeImage = $(event.detail.wallopEl).find('.Wallop-item--current').find('img')
            console.log(activeImage.attr('src'))
            if (activeImage.attr('src') === undefined) {

              activeImage.attr('src', activeImage.attr('data-src'))
            }

          })
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
