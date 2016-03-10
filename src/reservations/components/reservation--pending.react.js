var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips', 'common', 'countries']);

var currencies = require('currencies')

module.exports = React.createClass({
  approveReservation: function() {

    var approvalObj = {
      "reservationStatusRequest": "APPROVED"
    }

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/reservations/'+this.props.reservation.id,
      type: "POST",
      data: JSON.stringify(approvalObj),
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
  declineReservation: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/bookings/'+this.props.reservation.id,
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

    console.log(this.props.reservation)

  },
  render: function() {

    var reservation = this.props.reservation;

    var roomPhoto = domains.IMG + reservation.roomPhoto;
    var guestPhoto = domains.IMG + reservation.guestPhoto;
    var homeLink = domains.FRONTEND + '/homes/' + reservation.homeId;

    return (

      <li>
        <div className="collapsible-header">
          <span className='pending-reservation'>({i18n.t('trips:status_codes.PENDING')})</span><img src={roomPhoto} className='room-thumbnail' />Tandem immersion with Jose
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 center-align trip-user-actions'>
              <a className='btn btn-primary reservation-btn' onClick={this.approveReservation}>{i18n.t('trips:actions.approve')}</a>
              <a className='btn btn-secondary reservation-btn no-margin-bottom'>{i18n.t('trips:actions.decline')}</a>
              <div>
                <a className='small grey-text'>{i18n.t('trips:cancellation_policy')}</a>
              </div>
              <div className='margin-top-10 center-align'>
                <a><img src={guestPhoto} alt="" className="circle responsive-img reservation-profile-icon" /></a>
              </div>
              <div>
                <a>View details</a>
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
                    <th data-field="price">{i18n.t('trips:you_will_earn')}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>{i18n.t('trips:status_codes.PENDING')}</td>
                    <td>{reservation.roomName}</td>
                    <td>Eisenbahnstr. 19<br />Berlin, Germany</td>
                    <td>2016-05-18</td>
                    <td>2016-08-01</td>
                    <td>1</td>
                    <td><span className='large blue-text'>{currencies[reservation.chargesCurrency]}{reservation.baseCharges}</span></td>
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
