var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (

      <li className="collection-header col s12 m6 l6 border-right tandem-discount">
        <div className='row'>
          <div className='col s3 input-field center-align grey-text text-lighten-1'>
            <i className="fa fa-circle-o-notch fa-2x"></i>
          </div>
          <div className='col s9 input-field'>
            <input type="text" className="validate no-margin discount" data-lang={this.props.lang} placeholder='20%' defaultValue={this.props.discount+'%'} />
            <label className='lang' className='active'>{this.props.lang} discount</label>
          </div>
        </div>
      </li>

    );
  }
});
