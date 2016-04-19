const React = require('react');
const ReactDOM = require('react-dom');
const UserEditProfile = require('./components/user-edit-profile.react');

const domains = require('domains');

const toast = require('toast');

if ($('#user-edit-profile').length) {
  // Search parent
  ReactDOM.render(
    <UserEditProfile />, document.querySelector('#user-edit-profile')
  )

  $("#user_photo_upload").change(function()
  {
      $('#user_photo_upload').each(function(index, value)
      {
          var file = value.files;
          if(file)
          {
              var formData = new FormData();
              var token = JSON.parse(atob(localStorage.getItem('JWT').split('.')[1]));
              for(var f = 0; f < file.length; f++){
                formData.append('photos', file[f]);
              }

              $('#preloader').show();

              $.ajax({
                url : '/upload/users/'+token.rid+'/photo',
                type : 'POST',
                data : formData,
                cache : false,
                contentType : false,
                processData : false,
                beforeSend: function(xhr){xhr.setRequestHeader('abroadauth', 'Bearer ' + localStorage.getItem('JWT'))},
                success : function(data, textStatus, jqXHR) {

                      var message = jqXHR.responseText;
                      var result = JSON.parse(data);
                      for(var img in result){
                        if(result[img].status == 'OK'){
                          $('#user-photo').attr('src', domains.IMG + result[img].location);
                          window.userObj.photo = result[img].location;
                        }
                      }
                      $('#preloader').hide();
                },
                error: function(jqXHR) {
                  var message = jqXHR.responseText;
                  $('#preloader').hide();
                  toast('Failed: '+ message);

                }
              });
          }
      });
  });
}
