var React = require('react');
var i18n = require('../../global/components/i18n');

i18n.loadNamespaces(['manage_home','rooms']);

module.exports = React.createClass({
  render: function() {
    var img = this.props.img ? this.props.img : '';
    return (

      <li className="collection-item avatar room" data-id={this.props.id}>
        <img src={img} alt="" className="circle"></img>
        <span className="title">{this.props.roomName}</span>
        <p className='light'>
          {this.props.bed}
          <br></br>
          Vacancy: {this.props.vacancies}
        </p>
        <div className="secondary-content input-field">
          <input type="text" className="validate no-margin room-price" placeholder='150' defaultValue={this.props.price+this.props.currency} />
          <label className='active left'>{i18n.t('rooms:Weekly_rate')}</label>
        </div>
      </li>

    );
  }
});
