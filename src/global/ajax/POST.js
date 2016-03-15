var jwt_decode = require('jwt-decode');
var domains = require('domains');

module.exports = function(url, data, success, error) {
  
  var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json",
    data: JSON.stringify(data),
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
    success: function(JWT) {

      success;

    },
    error: function() {

      error !== 'undefined' ? error : alert('Something failed');

    }
  })

}
