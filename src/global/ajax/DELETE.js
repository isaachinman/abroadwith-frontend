const domains = require('domains');
const toast = require('toast')

module.exports = function(url, success, error) {

  $.ajax({
    type: "DELETE",
    url: url,
    contentType: "application/json",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
    success: function(response) {

      success(response);

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
