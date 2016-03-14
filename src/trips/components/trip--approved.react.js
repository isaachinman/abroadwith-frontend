var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips', 'common', 'countries']);

module.exports = React.createClass({
  cancelTrip: function() {

    $('#preloader').show();

    var refreshState = this.props.refreshState;
    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/bookings/'+this.props.trip.id,
      type: "POST",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        refreshState();
        $('#preloader').hide();

      },
      error: function() {

        alert('Something failed');

      }
    })

  },
  render: function() {

    var trip = this.props.trip;

    var roomPhoto = domains.IMG + trip.roomPhoto;
    var hostPhoto = domains.IMG + trip.hostPhoto;

    var invoices = [];
    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null

    var receiptUrl = domains.FRONTEND+"/users/"+JWT.rid+"/bookings/"+trip.id+"/receipt?booking_id="+trip.id;

    if (trip.invoiceIds.length > 0) {
      for (var i=0; i<trip.invoiceIds.length; i++) {
<<<<<<< HEAD
        var url = domains.FRONTEND+"/users/"+JWT.rid+"/invoices/"+trip.invoiceIds[i]+'?invoice_id='+trip.invoiceIds[i];
=======
        var url = domains.FRONTEND+"/users/"+JWT.rid+"/bookings/"+trip.id+"?invoice_id="+trip.invoiceIds[i];
>>>>>>> origin/development-unstable
        var text = i18n.t('trips:invoice') + " " + (i+1)
        invoices.push(
          <div><a href={url}>{text}</a></div>
        )
      }
    } else {
      invoices.push(
        i18n.t('trips:not_applicable')
      )
    }

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
          <span className='approved-reservation'>({i18n.t('trips:status_codes.APPROVED')})</span><img src={roomPhoto} className='room-thumbnail' />{i18n.t('trips:trip_with', {immersion:i18n.t('immersions:'+trip.immersionType), guest: trip.guestName, country:(i18n.t('countries:'+trip.homeAddress.country))})}
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
                <a href={receiptUrl}>{i18n.t('trips:view_receipt')}</a>
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
                    <th>{i18n.t('trips:invoices')}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>{i18n.t('trips:status_codes.APPROVED')}</td>
                    <td>{trip.roomName}</td>
                    <td>{trip.homeAddress.street}<br />{trip.homeAddress.city}, {i18n.t('countries:'+trip.homeAddress.country)}</td>
                    <td>{trip.arrivalDate}</td>
                    <td>{trip.departureDate}</td>
                    <td>{trip.guestCount}</td>
                    <td>{invoices}</td>
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
                    <th>{i18n.t('trips:contact_user', {user:trip.hostName})}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>&nbsp;</td>
                    <td>{i18n.t('immersions:'+trip.immersionType)}</td>
                    <td>{guestWillTeach}</td>
                    <td>{i18n.t('languages:')+trip.languageHostWillTeach}</td>
                    <td>{trip.weeklyHours}</td>
                    <td>{services}</td>
                    <td>{trip.hostPhone}<br />{trip.hostEmail}</td>
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
