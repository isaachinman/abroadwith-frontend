module.exports = function(nonce) {

  var domains = require('domains');
  var jwt_decode = require('jwt-decode');

  var newPaymentMethod = {
  "paymentMethodNonce": nonce,
  "isDefault": false
  }

  // Get user ID
  var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

  $.ajax({
    url: domains.API+'/users/'+JWT.rid+'/paymentMethods',
    type: "POST",
    data: JSON.stringify(newPaymentMethod),
    contentType: "application/json",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
    success: function(response) {

      console.log(response)

    },
    error: function() {

      alert('Something failed');

    }
  })

}
