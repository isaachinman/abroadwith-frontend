var React = require('react');

var domains = require('domains');
var JWT = require('JWT');

var i18n = require('../../global/util/i18n');

module.exports = React.createClass({
  render: function() {

    var trip = this.props.trip;

    var receiptUrl = "/users/"+JWT.rid+"/bookings/"+trip.id+"/receipt?booking_id="+trip.id;

    var whoCancelled = trip.status === 'CANCELLED_BY_HOST' ? i18n.t('trips:by_them') : i18n.t('trips:by_you');

    var roomPhoto = trip.roomPhoto !== null ? domains.IMG + trip.roomPhoto : domains.IMG + '/homes/default_room.png';

    var invoices = [];

    if (trip.invoiceIds.length > 0) {
      for (var i=0; i<trip.invoiceIds.length; i++) {
        var url = "/users/"+JWT.rid+"/invoices/"+trip.invoiceIds[i]+'?invoice_id='+trip.invoiceIds[i]
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

    return (

      <li>
        <div className="collapsible-header">
          <span className='cancelled-reservation'>({i18n.t('trips:status_codes.CANCELLED')} {whoCancelled})</span><img src={roomPhoto} className='room-thumbnail' />{i18n.t('trips:trip_with', {immersion:i18n.t('immersions:'+trip.immersionType), host: trip.hostName, country:(i18n.t('countries:'+trip.homeAddress.country))})}
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 center-align trip-user-actions'>
              <a className='btn disabled reservation-btn'>{i18n.t('trips:status_codes.CANCELLED')}</a>
                <div className='margin-top-10'>
                  <a href={receiptUrl}>{i18n.t('trips:view_receipt')}</a>
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
                    <td className='status'>{i18n.t('trips:status_codes.CANCELLED')}</td>
                    <td>{trip.roomName}</td>
                    <td>{trip.homeAddress.city}, {i18n.t('countries:'+trip.homeAddress.country)}</td>
                    <td>{trip.arrivalDate}</td>
                    <td>{trip.departureDate}</td>
                    <td>{trip.guestCount}</td>
                    <td>{invoices}</td>
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
