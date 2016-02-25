var React = require('react');
require('wnumb');

module.exports = React.createClass({
  componentDidMount: function() {

    // Set absolute range
    var rangeStart = 0;
    var rangeEnd = 500;

    // Establish some vars to use in child scopes
    var handleChange = this.props.handleChange;
    var slider = document.getElementById('price-slider');

    // If min/max aren't defined, set to absolute range
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

    // Init nouislider
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
        prefix: $('#ui-currency option:selected').attr('data-symbol'),
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
