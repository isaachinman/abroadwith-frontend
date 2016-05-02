const domains = require('domains');
const toast = require('toast')

module.exports = function(url, data, success, error) {

  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json",
    data: JSON.stringify(data),
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
    success: function(response) {

      success !== null ? success(response) : null;

    },
    error: function() {

      $('#preloader').hide();
      error !== undefined ? error() : toast('Something failed');

    }
  })

}
