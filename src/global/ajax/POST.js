var domains = require('domains');

module.exports = function(url, data, success, error) {

  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json",
    data: JSON.stringify(data),
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
