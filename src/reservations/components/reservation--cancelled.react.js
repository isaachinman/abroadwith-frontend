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

    var roomPhoto = domains.IMG + reservation.roomPhoto;

    return (

      <li>
        <div className="collapsible-header">
          <span className='cancelled-reservation'>({i18n.t('trips:status_codes.CANCELLED')})</span><img src={roomPhoto} className='room-thumbnail' />Tandem immersion with Jose
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
                    <td>{reservation.roomName}</td>
                    <td>Eisenbahnstr. 19<br />Berlin, Germany</td>
                    <td>{reservation.arrivalDate}</td>
                    <td>{reservation.departureDate}</td>
                    <td>{reservation.guestCount}</td>
                    <td><a>Invoice #1</a></td>
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
