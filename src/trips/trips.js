var domains = require('domains');
var jwt_decode = require('jwt-decode');

var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

$.ajax({
  url: domains.API+'/users/'+JWT.rid+'/bookings',
  type: "GET",
  contentType: "application/json",
  beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
  success: function(response) {

    console.log(response)

  }.bind(this),
  error: function() {

    alert('Something failed');

  }
})
