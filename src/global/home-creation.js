if ($('a.become-a-host').length) {

  var domains = require('domains');
  var jwt_decode = require('jwt-decode');
  var refreshToken = require('refresh-token');

  $('a.become-a-host').click(function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      type: "POST",
      url: domains.API+'/users/'+JWT.rid+'/homes',
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      processData: false,
      success: function(response){

        console.log(response)

        refreshToken(goToManageHome);

        function goToManageHome() {
          window.location = '/manage-home'
        }

      },
      error: function(response) {
        // Something went wrong
        console.log('home wasnt created')
      }
    });

  })

}
