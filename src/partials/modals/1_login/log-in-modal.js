if ($('#log-in-modal').length) {


    $('#login-modal-btn').click(function() {

      var loginObj = {};

      loginObj.email = $('#login-modal-email').val();
      loginObj.password = $('#login-modal-password').val();

      $.ajax({
          type: "POST",
          url: 'https://admin.abroadwith.com/users/login',
          dataType: 'JSON',
          data: JSON.stringify(loginObj),
          success: function (data) {
            alert(data);
          }
      })
      
    })



}
