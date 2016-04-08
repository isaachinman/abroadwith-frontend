var React = require('react');

var domains = require('domains');
var JWT = require('JWT');
var POST = require('POST');

var i18n = require('../../global/util/i18n');

module.exports = React.createClass({
  cancelTrip: function() {

    $('#preloader').show();

    var url = domains.API+'/users/'+JWT.rid+'/bookings/'+this.props.trip.id;
    var success = function() {
      this.props.refreshState();
      $('#preloader').hide();
    }.bind(this)
    POST(url, {}, success);

  },
  render: function() {

    var trip = this.props.trip;

    var roomPhoto = trip.roomPhoto !== null ? domains.IMG + trip.roomPhoto : '';
    var hostPhoto = trip.hostPhoto ? domains.IMG + trip.hostPhoto : domains.IMG+'/users/default.jpg';
    var homeLink = '/homes/' + trip.homeId;

    var created = new Date(trip.created)

    console.log(created)
    console.log('ok')

    var guestWillTeach = trip.languageGuestWillTeach !== null ? i18n.t('languages:'+trip.languageGuestWillTeach) : i18n.t('trips:not_applicable');

    var services = []

    if (trip.homeServices.indexOf('HALF_BOARD') === -1 && trip.homeServices.indexOf('FULL_BOARD') === -1) {
      var breakfast = i18n.t('trips:home_services.BREAKFAST')
      services.push(
        <div>{breakfast}</div>
      );
    }

    for (var i=0; i < trip.homeServices.length; i++) {
      var service = i18n.t('trips:home_services.'+trip.homeServices[i]);
      services.push(
        <div>{service}</div>
      );
    }

    return (

      <li>
        <div className="collapsible-header">
          <span className='pending-reservation'>({i18n.t('trips:status_codes.PENDING')})</span><img src={roomPhoto} className='room-thumbnail' />{i18n.t('trips:trip_with', {immersion:i18n.t('immersions:'+trip.immersionType), host:trip.hostName, country:i18n.t('countries:'+trip.homeAddress.country)})}
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 center-align trip-user-actions'>
              <a className='btn btn-delete btn-flat trip-btn reservation-btn' onClick={this.cancelTrip}>{i18n.t('trips:cancel')}</a>
              <div>
                <a className='small grey-text'>{i18n.t('trips:cancellation_policy')}</a>
              </div>
              <div className='margin-top-10 center-align'>
                <a><img src={hostPhoto} alt="" className="circle responsive-img reservation-profile-icon" /></a>
              </div>
              <div>
                <a href={homeLink}>{i18n.t('trips:view_room')}</a>
              </div>
            </div>
            <div className='col s12 m12 l10 margin-top-20'>
              <table className='border responsive-table trips-table'>
                <thead>
                  <tr>
                    <th className='status'>{i18n.t('trips:status')}</th>
                    <th>{i18n.t('trips:room_name')}</th>
                    <th>{i18n.t('trips:location')}</th>
                    <th>{i18n.t('common:Arrival')}</th>
                    <th>{i18n.t('common:Departure')}</th>
                    <th>{i18n.t('common:Guests')}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>{i18n.t('trips:status_codes.PENDING')} <br /><span id='creation-date'></span></td>
                    <td>{trip.roomName}</td>
                    <td>{trip.homeAddress.city}, {i18n.t('countries:'+trip.homeAddress.country)}</td>
                    <td>{trip.arrivalDate}</td>
                    <td>{trip.departureDate}</td>
                    <td>{trip.guestCount}</td>
                  </tr>
                </tbody>

                <thead className='second'>
                  <tr>
                    <th className='status'>&nbsp;</th>
                    <th>{i18n.t('trips:immersion_type')}</th>
                    <th>{i18n.t('trips:you_teach')}</th>
                    <th>{i18n.t('trips:they_teach')}</th>
                    <th>{i18n.t('trips:hours_per_week')}</th>
                    <th>{i18n.t('trips:services')}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>&nbsp;</td>
                    <td>{i18n.t('immersions:'+trip.immersionType)}</td>
                    <td>{guestWillTeach}</td>
                    <td>{i18n.t('languages:'+trip.languageHostWillTeach)}</td>
                    <td>{trip.weeklyHours}</td>
                    <td>{services}</td>
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
