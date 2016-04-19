const React = require('react');

const domains = require('domains');
const JWT = require('JWT');
const POST = require('POST');

const i18n = require('i18n');

module.exports = React.createClass({
  cancelReservation: function() {

    $('#preloader').show();

    var declineObj = {"reservationStatusRequest":"CANCELLED"}

    var url = domains.API+'/users/'+JWT.rid+'/reservations/'+this.props.reservation.id;
    var success = function() {
      this.props.refreshState();
      $('#preloader').hide();
    }.bind(this)
    POST(url, declineObj, success);

  },
  render: function() {

    var reservation = this.props.reservation;

    var roomPhoto = reservation.roomPhoto !== null ? domains.IMG + reservation.roomPhoto : domains.IMG + '/homes/default_room.png';
    var guestPhoto = reservation.guestPhoto ? domains.IMG + reservation.guestPhoto : domains.IMG+'/users/default.jpg';

    var invoices = [];

    var receiptUrl = "/users/"+JWT.rid+"/reservations/"+reservation.id+"/confirmation?booking_id="+reservation.id;

    if (reservation.invoiceIds.length > 0) {
      for (var i=0; i<reservation.invoiceIds.length; i++) {
        var url = "/users/"+JWT.rid+"/invoices/"+reservation.invoiceIds[i]+'?invoice_id='+reservation.invoiceIds[i];
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

    var guestWillTeach = reservation.languageGuestWillTeach !== null ? i18n.t('languages:'+reservation.languageGuestWillTeach) : i18n.t('trips:not_applicable');

    var hostWillTeach = i18n.t('languages:'+reservation.languageHostWillTeach);

    var services = []

    if (reservation.homeServices.indexOf('HALF_BOARD') === -1 && reservation.homeServices.indexOf('FULL_BOARD') === -1) {
      var breakfast = i18n.t('trips:home_services.BREAKFAST')
      services.push(
        <div>{breakfast}</div>
      );
    }

    for (var i=0; i < reservation.homeServices.length; i++) {
      var service = i18n.t('trips:home_services.'+reservation.homeServices[i]);
      services.push(
        <div>{service}</div>
      );
    }

    var guestProfUrl = 'users/' + reservation.guestId;

    return (

      <li>
        <div className="collapsible-header">
          <span className='approved-reservation'>({i18n.t('trips:status_codes.APPROVED')})</span><img src={roomPhoto} className='room-thumbnail' />{i18n.t('trips:reservation_with', {immersion:i18n.t('immersions:'+reservation.immersionType), guest: reservation.guestName})}
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 center-align trip-user-actions'>
              <a className='btn btn-delete btn-flat reservation-btn' onClick={this.cancelReservation}>{i18n.t('trips:cancel')}</a>
              <div>
                <a className='small grey-text'>{i18n.t('trips:cancellation_policy')}</a>
              </div>
              <div className='margin-top-10 center-align'>
                <a href={guestProfUrl}><img src={guestPhoto} alt="" className="circle responsive-img reservation-profile-icon" /></a>
              </div>
              <div>
                <a href={receiptUrl}>{i18n.t('trips:immersion_confirmation')}</a>
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
                    <th data-field="price">{i18n.t('trips:invoices')}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>{i18n.t('trips:status_codes.APPROVED')}</td>
                    <td>{reservation.roomName}</td>
                    <td>{reservation.homeAddress.street}<br />{reservation.homeAddress.city}, {i18n.t('countries:'+reservation.homeAddress.country)}</td>
                    <td>{reservation.arrivalDate}</td>
                    <td>{reservation.departureDate}</td>
                    <td>{reservation.guestCount}</td>
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
                    <th>{i18n.t('trips:contact_user', {user:reservation.guestName})}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>&nbsp;</td>
                    <td>{i18n.t('immersions:'+reservation.immersionType)}</td>
                    <td>{hostWillTeach}</td>
                    <td>{guestWillTeach}</td>
                    <td>{reservation.weeklyHours}</td>
                    <td>{services}</td>
                    <td>{reservation.guestPhone}<br />{reservation.guestEmail}</td>
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
