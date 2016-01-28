var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className='row valign-wrapper section' onChange={this.handleChange}>
        <div className='input-field col s2 grey-text'>
          <div className='chip chip-grey'>Dates</div>
        </div>
        <div className='input-field col s3 valign'>
          <input id='arrival' type="text" className='datepicker' value={this.props.arrival} />
          <label htmlFor='arrival'>Arrival</label>
        </div>
        <div className='input-field col s3 valign'>
          <input id='departure' type="text" className="datepicker" value={this.props.departure} />
          <label htmlFor='departure'>Departure</label>
        </div>
        <div className='input-field col s4'>
          <select id='guests' className='material' value={this.props.guests} >
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
            <option value="5">5 guests</option>
          </select>
        </div>
      </div>
    );
  }
});
