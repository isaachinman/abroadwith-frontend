// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var AdminEdit = require('./components/admin-edit.react');


if ($('#admin-edit').length) {
  // Admin parent
  ReactDOM.render(
    <AdminEdit />, document.querySelector('#admin-edit')
  )

  $("#user_id_upload").change(function()
  {
      $('#user_id_upload').each(function(index, value)
      {
          var file = value.files;
          if(file)
          {
              var formData = new FormData();
              var token = JSON.parse(atob(localStorage.getItem('JWT').split('.')[1]));
              for(var f = 0; f < file.length; f++){
                formData.append('photos', file[f]);
              }
              $.ajax({
                url : '/upload/users/'+token.rid+'/id',
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
                          alert('ID has been submitted!');
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
