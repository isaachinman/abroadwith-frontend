var React = require('react');

module.exports = React.createClass({
  render: function() {

    return (
      <div className='row section valign-wrapper'>
        <div className='col s2 grey-text'>
          <div className='chip chip-grey'>Language</div>
        </div>
        <div className='col s3'>
          <select id="language" type="text" className="validate border-radius-left" value={this.props.immersion}>
            <option></option>
            <option value='eng'>English</option>
            <option value='spa'>Spanish</option>
          </select>
        </div>

        <div className='col s2 grey-text'>
          <div className='chip chip-grey'>Immersion</div>
        </div>

        <div className='col s5'>
          <select id='immersion' className='material' multiple={true} value={this.props.immersion} >
            <option value="stay">Stay</option>
            <option value="tandem">Tandem</option>
            <option value="teacher">Teachers stay</option>
          </select>
        </div>

      </div>
    );
  }
});
