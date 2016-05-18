const React = require('react');

const jwt_decode = require('jwt-decode');
const domains = require('domains');

const i18n = require('i18n');

module.exports = React.createClass({
  render: function() {

    var reservation = this.props.reservation;

    if (reservation.status === 'DECLINED_BY_GUEST') {
      whoDeclined = i18n.t('trips:by_them');
    } else if (reservation.status === 'DECLINED_BY_HOST') {
      whoDeclined = i18n.t('trips:by_you')
    } else if (reservation.status === 'DECLINED_AUTOMATICALLY') {
      whoDeclined = i18n.t('trips:automatically');
    }

    var roomPhoto = reservation.roomPhoto !== null ? domains.IMG + reservation.roomPhoto : domains.IMG + '/homes/default_room.png';
    var guestPhoto = reservation.hostPhoto ? domains.IMG + reservation.hostPhoto : '';

    var homeLink = '/homestay/' + reservation.homeId;

    var homeAddress = reservation.homeAddress !== null ? reservation.homeAddress.street + ', ' + reservation.homeAddress.city + ', ' + i18n.t('countries:'+reservation.homeAddress.country) : i18n.t('trips:not_applicable')
    var tripWith = i18n.t('trips:reservation_with', {immersion:i18n.t('immersions:'+reservation.immersionType), guest: reservation.guestName !== null ? reservation.guestName : i18n.t('common:deleted_account') })

    return (

      <li>
        <div className="collapsible-header">
          <span className='declined-reservation'>({i18n.t('trips:status_codes.DECLINED')} {whoDeclined})</span><img src={roomPhoto} className='room-thumbnail' />{tripWith}
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
                    <td>{homeAddress}</td>
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
