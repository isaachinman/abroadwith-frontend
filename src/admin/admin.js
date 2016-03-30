// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var AdminEdit = require('./components/admin-edit.react');
var i18n = require('../global/util/i18n');

if ($('#admin-edit').length) {
  i18n.loadNamespaces(['admin','users','languages', 'common','countries'],function(){
    // Admin parent
    ReactDOM.render(
      <AdminEdit />, document.querySelector('#admin-edit')
    )

    // Clicking on add payout method headers toggles the form
    $('.add-payout .header').click(function() {
      $(this).next().slideToggle();
    })

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
                            alert(i18n.t('admin:upload_id_success_alert'));
                          }
                        }
                  },
                  error: function(jqXHR) {
                    var message = jqXHR.responseText;
                    alert(i18n.t('admin:upload_id_failed_alert') + ' ' + message);
                  }
                });
            }
        });
    });
  });
}
