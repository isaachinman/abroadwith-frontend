var React = require('react');
var domains = require('domains');
var jwt_decode = require('jwt-decode')

module.exports = React.createClass({
  userEditSave: function() {

    // Create new basics object
    var newProfileObj = {};

    // Fill values
    $('#about-me').val() !== 'undefined'          ? newProfileObj.aboutMe = $('#about-me').val() : null;
    $('#education').val() !== 'undefined'         ? newProfileObj.education = $('#education').val() : null;
    $('#grew-up').val() !== 'undefined'           ? newProfileObj.grewUp = $('#grew-up').val() : null;
    $('#fav-book').val() !== 'undefined'          ? newProfileObj.favBook = $('#fav-book').val() : null;
    $('#fav-film').val() !== 'undefined'          ? newProfileObj.favFilm = $('#fav-film').val() : null;
    $('#amazing-feat').val() !== 'undefined'      ? newProfileObj.amazingFeat = $('#amazing-feat').val() : null;
    $('#can-share').val() !== 'undefined'         ? newProfileObj.canShare = $('#can-share').val() : null;
    $('#interests').val() !== 'undefined'         ? newProfileObj.interests = $('#interests').val() : null;
    $('#countries-visited').val() !== 'undefined' ? newProfileObj.countriesVisited = $('#countries-visited').val() : null;
    $('#countries-lived').val() !== 'undefined'   ? newProfileObj.countriesLived = $('#countries-lived').val() : null;

    console.log(newProfileObj)

  },
  componentDidMount: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    console.log(JWT.rid);

    $.ajax({
      url: domains.API+'/users/'+JWT.rid,
      data: { signature: authHeader },
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', 'test-value');},
      success: function(data) {

        // Parse the response
        var response = JSON.parse(data);

        $('#user-photo').attr('src', response.photo);
        $('#about-me').val(response.aboutMe);
        $('#education').val(response.education);
        $('#grew-up').val(response.grewUp);
        $('#fav-book').val(response.favBook);
        $('#fav-film').val(response.favFilm);
        $('#amazing-feat').val(response.amazingFeat);
        $('#can-share').val(response.canShare);
        $('#interests').val(response.interests);
        $('#countries-visited').val(response.countriesVisited).trigger('change');
        $('#countries-lived').val(response.countriesLived).trigger('change');

      }
    }.bind(this))

    // Select2
    $("select#countries-visited").select2();
    $("select#countries-lived").select2({
      allowClear: true
    });

  },
  render: function() {

    $('#user-edit-save').click(this.userEditSave);

    return (

      <div></div>

    )
  }
});
