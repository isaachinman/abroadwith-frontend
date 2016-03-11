var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips', 'common', 'countries']);

module.exports = React.createClass({
  cancelBooking: function() {

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

    console.log(this.props.reservation)

  },
  render: function() {

    var reservation = this.props.reservation;

    var roomPhoto = domains.IMG + reservation.roomPhoto;
    var guestPhoto = domains.IMG + reservation.guestPhoto;

    return (

      <li>
        <div className="collapsible-header">
          <span className='approved-reservation'>({i18n.t('trips:status_codes.APPROVED')})</span><img src={roomPhoto} className='room-thumbnail' />Tandem immersion with Jose<span className='hide-on-small-and-down'> in Spain</span>
        </div>
        <div className="collapsible-body white">
          <div className='row relative'>
            <div className='col s12 m12 l2 margin-top-20 center-align trip-user-actions'>
              <a className='btn btn-delete btn-flat reservation-btn'>{i18n.t('trips:cancel')}</a>
              <div>
                <a className='small grey-text'>{i18n.t('trips:cancellation_policy')}</a>
              </div>
              <div className='margin-top-10 center-align'>
                <a><img src={guestPhoto} alt="" className="circle responsive-img reservation-profile-icon" /></a>
              </div>
              <div>
                <a>View receipt</a>
              </div>
            </div>
            <div className='col s12 m12 l10 margin-top-20'>
              <table className='border responsive-table trips-table'>
                <thead>
                  <tr>
                    <th data-field="id" className='status'>Status</th>
                    <th data-field="id">Room name</th>
                    <th data-field="name">Location</th>
                    <th data-field="price">Arrival</th>
                    <th data-field="price">Departure</th>
                    <th data-field="price">Guests</th>
                    <th data-field="price">Invoice(s)</th>
                  </tr>
                </thead>

                <tbody className='grey lighten-4'>
                  <tr>
                    <td className='status'>Accepted</td>
                    <td>Master bedroom</td>
                    <td>Eisenbahnstr. 19<br />Berlin, Germany</td>
                    <td>2016-05-18</td>
                    <td>2016-08-01</td>
                    <td>1</td>
                    <td><a>Invoice #1</a></td>
                  </tr>
                  <tr>
                    <td className='status'>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>+33659034158<br />jose@abroadwith.com</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td><a>Invoice #2</a></td>
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
