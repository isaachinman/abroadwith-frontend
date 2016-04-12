var React = require('react');
var i18n = require('../../global/util/i18n');

var domains = require('domains');

module.exports = React.createClass({
  render: function() {

    var img = this.props.img ? domains.IMG + this.props.img : domains.IMG + '/homes/default_room.png';
    console.log(img)
    var price = this.props.price !== null ? this.props.price + ' ' + this.props.currency : '';
    var bedType = this.props.bed;

    return (

      <li className="collection-item avatar room tooltipped" data-id={this.props.id} data-position="bottom" data-delay="500" data-tooltip={i18n.t('rooms:price_tooltip')}>
        <img src={img} alt="" className="circle"></img>
        <span className="title">{this.props.roomName}</span>
        <p className='light'>
          {i18n.t('rooms:bed_types.'+bedType)}
          <br></br>
          Vacancy: {this.props.vacancies}
        </p>
        <div className="secondary-content input-field">
          <input type="text" className="validate no-margin room-price" placeholder='150' defaultValue={price} />
          <label className='active left'>{i18n.t('rooms:Weekly_rate')}</label>
        </div>
      </li>

    );
  }
});
