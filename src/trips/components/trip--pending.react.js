var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips', 'common', 'countries']);

module.exports = React.createClass({
  cancelTrip: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/bookings/'+this.props.trip.id,
      type: "POST",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        console.log(response)

      },
      error: function() {

        alert('Something failed');

      }
    })

  },
  componentDidMount: function() {

    console.log(this.props.trip)

  },
  render: function() {

    var trip = this.props.trip;

    var roomPhoto = domains.IMG + trip.roomPhoto;
    var hostPhoto = domains.IMG + trip.hostPhoto;
    var homeLink = domains.FRONTEND + '/homes/' + trip.homeId;

    return (

      <li>
        <div className="collapsible-header">
          <span className='pending-reservation'>({i18n.t('trips:status_codes.PENDING')})</span><img src={roomPhoto} className='room-thumbnail' />{i18n.t('trips:immersion_with', {immersion:'Tandem', host: 'Jose', country: 'Spain'})}
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 center-align trip-user-actions'>
              <a className='btn btn-delete btn-flat reservation-btn' onClick={this.cancelTrip}>{i18n.t('trips:cancel')}</a>
              <div>
                <a className='small grey-text'>{i18n.t('trips:cancellation_policy')}</a>
              </div>
              <div className='margin-top-10 center-align'>
                <a><img src={hostPhoto} alt="" className="circle responsive-img reservation-profile-icon" /></a>
              </div>
              <div>
                <a href={homeLink}>{i18n.t('trips:view_room')}</a>
              </div>
              <div>
                <a>{i18n.t('trips:view_details')}</a>
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
                    <td className='status'>{i18n.t('trips:status_codes.PENDING')}</td>
                    <td>{trip.roomName}</td>
                    <td>{trip.homeAddress.city}, {i18n.t('countries:'+trip.homeAddress.country)}</td>
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
