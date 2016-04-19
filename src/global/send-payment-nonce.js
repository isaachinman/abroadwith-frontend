const domains = require('domains');
const JWT = require('JWT');
const POST = require('POST');


module.exports = function(nonce, callback) {

  var newPaymentMethod = {
  "paymentMethodNonce": nonce,
  "isDefault": false
  }

  var url = domains.API+'/users/'+JWT.rid+'/paymentMethods';
  var success = callback;
  POST(url, newPaymentMethod, success);

}
