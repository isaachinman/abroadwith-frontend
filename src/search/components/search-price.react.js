var React = require('react');
var Nouislider = require('react-nouislider');
require('wnumb');

module.exports = React.createClass({
  render: function() {

    return (
      <div className='row valign-wrapper section'>
        <div className='col s2 grey-text'>
          <div className='chip chip-grey'>Price</div>
        </div>
        <div id='price-slider' className='col s10 valign'>
          <Nouislider
            range={{min: 0, max: 2000}}
            start={[this.props.minPrice, this.props.maxPrice]}
            connect={true}
            tooltips
            format={wNumb({
              prefix: '€',
              decimals: 0,
              encoder: function(a) {
                return a === 2000 ? a + '+' : a;
              }
            })}
            step={10}
          />
        </div>
      </div>
    );
  }
});
