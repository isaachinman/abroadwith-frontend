var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips', 'common', 'countries', 'homes', 'languages']);

var currencies = require('currencies')

module.exports = React.createClass({
  approveReservation: function() {

    var approvalObj = {"reservationStatusRequest":"APPROVED"}

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/reservations/'+this.props.reservation.id,
      type: "POST",
      data: JSON.stringify(approvalObj),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        // Refresh state

      },
      error: function() {

        alert('Something failed');

      }
    })

  },
  declineReservation: function() {

    var declineObj = {"reservationStatusRequest":"CANCELLED"}

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/reservations/'+this.props.reservation.id,
      type: "POST",
      data: JSON.stringify(declineObj),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        refreshState();

      },
      error: function() {

        alert('Something failed');

      }
    })

  },
  componentDidMount: function() {

    console.log(this.props.refreshState)

  },
  render: function() {

    var reservation = this.props.reservation;

    console.log(new Date(reservation.arrivalDate).getTime())

    var roomPhoto = domains.IMG + reservation.roomPhoto;
    var guestPhoto = domains.IMG + reservation.guestPhoto;
    var homeLink = domains.FRONTEND + '/homes/' + reservation.homeId;
    var guestWillTeach = reservation.languageGuestWillTeach !== null ? i18n.t('languages:'+reservation.languageGuestWillTeach) : i18n.t('trips:not_applicable');

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

    return (

      <li>
        <div className="collapsible-header">
          <span className='pending-reservation'>({i18n.t('trips:status_codes.PENDING')})</span><img src={roomPhoto} className='room-thumbnail' />{i18n.t('trips:reservation_with', {immersion:i18n.t('immersions:'+reservation.immersionType), guest: reservation.guestName})}
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 center-align trip-user-actions'>
              <a className='btn btn-primary reservation-btn' onClick={this.approveReservation}>{i18n.t('trips:actions.approve')}</a>
              <a className='btn btn-secondary reservation-btn no-margin-bottom' onClick={this.declineReservation}>{i18n.t('trips:actions.decline')}</a>
              <div>
                <a className='small grey-text'>{i18n.t('trips:cancellation_policy')}</a>
              </div>
              <div className='margin-top-10 center-align'>
                <a><img src={guestPhoto} alt="" className="circle responsive-img reservation-profile-icon" /></a>
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
                    <th>{i18n.t('trips:you_will_earn')}</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>{i18n.t('trips:status_codes.PENDING')}</td>
                    <td>{reservation.roomName}</td>
                    <td>{reservation.homeAddress.street}<br />{reservation.homeAddress.city}, {i18n.t('countries:'+reservation.homeAddress.country)}</td>
                    <td>{reservation.arrivalDate}</td>
                    <td>{reservation.departureDate}</td>
                    <td>{reservation.guestCount}</td>
                    <td><span className='large blue-text'>{currencies[reservation.chargesCurrency]}{reservation.baseCharges}</span></td>
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
                    <th>&nbsp;</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>&nbsp;</td>
                    <td>{i18n.t('immersions:'+reservation.immersionType)}</td>
                    <td>{i18n.t('languages:')+reservation.languageHostWillTeach}</td>
                    <td>{guestWillTeach}</td>
                    <td>{reservation.weeklyHours}</td>
                    <td>{services}</td>
                    <td>&nbsp;</td>
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
