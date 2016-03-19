var jwt_decode = require('jwt-decode');
var domains = require('domains');

module.exports = function(url, success, error) {

  $.ajax({
    type: "DELETE",
    url: url,
    contentType: "application/json",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
    success: function(response) {

      success(response);

    },
    error: function() {

      $('#preloader').hide();
      error !== 'undefined' ? error : alert('Something failed');

    }
  })

}
