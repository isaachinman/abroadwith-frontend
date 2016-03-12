var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips', 'common', 'countries']);

module.exports = React.createClass({
  render: function() {

    var trip = this.props.trip;

    var whoCancelled = trip.status === 'CANCELLED_BY_HOST' ? i18n.t('trips:by_you') : i18n.t('trips:by_them');

    var roomPhoto = domains.IMG + trip.roomPhoto;

    var invoices = [];
    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null

    if (trip.invoiceIds.length > 0) {
      for (var i=0; i<trip.invoiceIds.length; i++) {
        var url = domains.FRONTEND+"/users/"+JWT.rid+"/invoices/"+trip.invoiceIds[i]
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
            <div className='col s12 m12 l2 margin-top-20 left-align trip-user-actions'>
              <a className='btn disabled reservation-btn'>{i18n.t('trips:status_codes.CANCELLED')}</a>
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
