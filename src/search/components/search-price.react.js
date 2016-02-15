var React = require('react');
require('wnumb');

module.exports = React.createClass({
  componentDidMount: function() {

    var rangeStart = 0;
    var rangeEnd = 500;

    var handleChange = this.props.handleChange;
    var slider = document.getElementById('price-slider');

    var minPrice, maxPrice
    if (this.props.minPrice === undefined || this.props.minPrice == null || this.props.minPrice == 'undefined') {
      minPrice = rangeStart;
    } else {
      minPrice = this.props.minPrice;
    }
    if (this.props.maxPrice === undefined || this.props.maxPrice == null || this.props.maxPrice == 'undefined') {
      maxPrice = rangeEnd;
    } else {
      maxPrice = this.props.maxPrice;
    }

    noUiSlider.create(slider, {
    	start: [minPrice, maxPrice],
    	connect: true,
    	range: {
    		'min': 0,
    		'max': 500
    	},
      step: 10,
      tooltips: true,
      format: wNumb({
        decimals:0,
        prefix: '€',
        encoder: function(a) {
          return a === 2000 ? a + '+' : a;
        }
      })
    });

    slider.noUiSlider.on('set', handleChange);

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
