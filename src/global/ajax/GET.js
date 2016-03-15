var jwt_decode = require('jwt-decode');
var domains = require('domains');

module.exports = function(url, success, error) {

  $.ajax({
    type: "GET",
    url: url,
    contentType: "application/json",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
    success: function(response) {

      console.log('ran')

      success(response);

    },
    error: function() {

      error !== 'undefined' ? error : alert('Something failed');

    }
  })

}
