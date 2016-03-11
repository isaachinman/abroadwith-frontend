var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips', 'common', 'countries']);

module.exports = React.createClass({
  componentDidMount: function() {

    console.log(this.props.reservation)

  },
  render: function() {

    var reservation = this.props.reservation;

    var whoDeclined = reservation.status === 'DECLINED_BY_HOST' ? i18n.t('trips:by_you') : i18n.t('trips:by_them');

    var roomPhoto = domains.IMG + reservation.roomPhoto;
    var guestPhoto = domains.IMG + reservation.guestPhoto;

    return (

      <li>
        <div className="collapsible-header">
          <span className='declined-reservation'>({i18n.t('trips:status_codes.DECLINED')} {whoDeclined})</span><img src={roomPhoto} className='room-thumbnail' />{i18n.t('trips:reservation_with', {immersion:i18n.t('immersions:'+reservation.immersionType), guest: reservation.guestName})}
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 left-align trip-user-actions'>
              <a className='btn disabled reservation-btn'>{i18n.t('trips:status_codes.DECLINED')}</a>
            </div>
            <div className='col s12 m12 l10 margin-top-20'>
              <table className='border responsive-table trips-table'>
                <thead>
                  <tr>
                    <th data-field="id" className='status'>{i18n.t('trips:status')}</th>
                    <th data-field="id">{i18n.t('trips:room_name')}</th>
                    <th data-field="name">{i18n.t('trips:location')}</th>
                    <th data-field="price">{i18n.t('common:Arrival')}</th>
                    <th data-field="price">{i18n.t('common:Departure')}</th>
                    <th data-field="price">{i18n.t('common:Guests')}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>{i18n.t('trips:status_codes.DECLINED')} {whoDeclined}</td>
                    <td>{reservation.roomName}</td>
                    <td>{reservation.homeAddress.street}<br />{reservation.homeAddress.city}, {i18n.t('countries:'+reservation.homeAddress.country)}</td>
                    <td>{reservation.arrivalDate}</td>
                    <td>{reservation.departureDate}</td>
                    <td>{reservation.guestCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </li>

    );
  }
});
