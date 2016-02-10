var React = require('react');
require('wnumb');

module.exports = React.createClass({
  componentDidMount: function() {

    var handleChange = this.props.handleChange;

    var slider = document.getElementById('price-slider');

    noUiSlider.create(slider, {
    	start: [20, 80],
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
      <div className='row valign-wrapper section'>
        <div className='col s2 grey-text'>
          <div className='chip chip-grey'>Price</div>
        </div>
        <div id='price-slider' className='col s10 valign'>

        </div>
      </div>
    );
  }
});
