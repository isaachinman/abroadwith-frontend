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
    error: function(response) {

      if (response.status === 401) {
        window.location = '/login'
      } else {
        $('#preloader').hide();
        typeof error === 'function' ? error(response) : toast('Something failed');
      }

    }
  })

}
