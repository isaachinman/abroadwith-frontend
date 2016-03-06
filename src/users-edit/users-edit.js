// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var UserEditProfile = require('./components/user-edit-profile.react');
var domains = require('domains');

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
              console.log(localStorage.getItem('JWT'));
              for(var f = 0; f < file.length; f++){
                console.log(formData);
                formData.append('photos', file[f]);
                console.log(formData);
                console.log(file[f]);
              }
              $.ajax({
                url : '/upload/users/'+token.rid+'/photo',
                type : 'POST',
                data : formData,
                cache : false,
                contentType : false,
                processData : false,
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
                success : function(data, textStatus, jqXHR) {
                      var message = jqXHR.responseText;
                      var result = JSON.parse(data);
                      for(var img in result){
                        if(result[img].status == 'OK'){
                          $('#user-photo').attr('src', domains.IMG + result[img].location);
                        }
                      }
                },
                error: function(jqXHR) {
                  var message = jqXHR.responseText;
                  alert('Failed: '+ message);

                }
              });
          }
      });
  });
}
