const React = require('react');

const domains = require('domains');

const i18n = require('i18n');

module.exports = React.createClass({
  render: function() {

    var trip = this.props.trip;
    var whoDeclined;

    if (trip.status === 'DECLINED_BY_GUEST') {
      whoDeclined = i18n.t('trips:by_you');
    } else if (trip.status === 'DECLINED_BY_HOST') {
      whoDeclined = i18n.t('trips:by_host');
    } else if (trip.status === 'DECLINED_AUTOMATICALLY') {
      whoDeclined = i18n.t('trips:automatically');
    }

    var roomPhoto = trip.roomPhoto !== null ? domains.IMG + trip.roomPhoto : domains.IMG + '/homes/default_room.png';
    var hostPhoto = trip.hostPhoto ? domains.IMG + trip.hostPhoto : domains.IMG+'/users/default.jpg';

    var homeLink = '/homes/' + trip.homeId;

    var homeAddress = trip.homeAddress ? trip.homeAddress.city + ', ' + i18n.t('countries:'+trip.homeAddress.country) : i18n.t('trips:not_applicable')

    return (

      <li>
        <div className="collapsible-header">
          <span className='declined-reservation'>({i18n.t('trips:status_codes.DECLINED')} {whoDeclined})</span><img src={roomPhoto} className='room-thumbnail' />{i18n.t('trips:trip_with', {immersion:i18n.t('immersions:'+trip.immersionType), host:trip.hostName, country:i18n.t('countries:'+trip.homeAddress.country)})}
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 left-align trip-user-actions'>
              <a className='btn disabled reservation-btn'>{i18n.t('trips:status_codes.DECLINED')}</a>
                <div className='margin-top-10 center-align'>
                  <a href={homeLink}>{i18n.t('trips:view_room')}</a>
                </div>
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
                    <td>{trip.roomName}</td>
                    <td>{homeAddress}</td>
                    <td>{trip.arrivalDate}</td>
                    <td>{trip.departureDate}</td>
                    <td>{trip.guestCount}</td>
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
