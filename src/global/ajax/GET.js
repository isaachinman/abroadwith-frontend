var domains = require('domains')
var toast = require('toast')

module.exports = function(url, success, error) {

  $.ajax({
    type: "GET",
    url: url,
    contentType: "application/json",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
    success: function(response) {

      success(response);

    },
    error: function() {

      error !== 'undefined' ? error : toast('Something failed');
      $('#preloader').hide();

    }
  })

}
