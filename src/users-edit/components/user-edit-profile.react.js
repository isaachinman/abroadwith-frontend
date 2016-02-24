var React = require('react');
var domains = require('domains');
var jwt_decode = require('jwt-decode')

module.exports = React.createClass({
  userEditSave: function() {

    delete userObj.paymentMethods;
    delete userObj.payoutMethods;
    delete userObj.verifications;

    // Fill values
    $('#about-me').val() !== 'undefined'          ? userObj.aboutMe = $('#about-me').val() : null;
    $('#education').val() !== 'undefined'         ? userObj.education = $('#education').val() : null;
    $('#grew-up').val() !== 'undefined'           ? userObj.grewUp = $('#grew-up').val() : null;
    $('#fav-book').val() !== 'undefined'          ? userObj.favBook = $('#fav-book').val() : null;
    $('#fav-film').val() !== 'undefined'          ? userObj.favFilm = $('#fav-film').val() : null;
    $('#amazing-feat').val() !== 'undefined'      ? userObj.amazingFeat = $('#amazing-feat').val() : null;
    $('#can-share').val() !== 'undefined'         ? userObj.canShare = $('#can-share').val() : null;
    $('#interests').val() !== 'undefined'         ? userObj.interests = $('#interests').val() : null;
    $('#countries-visited').val() !== 'undefined' ? userObj.countriesVisited = JSON.stringify($('#countries-visited').val()) : null;
    $('#countries-lived').val() !== 'undefined'   ? userObj.countriesLived = JSON.stringify($('#countries-lived').val()) : null;

    console.log(userObj)

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid,
      type: "POST",
      data: JSON.stringify(userObj),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        this.refreshState();

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  refreshState: function() {
    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid,
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        window.userObj = response;

        console.log(response)

        $('#user-photo').attr('src', response.photo);
        $('#about-me').val(response.aboutMe);
        $('#education').val(response.education);
        $('#grew-up').val(response.grewUp);
        $('#fav-book').val(response.favBook);
        $('#fav-film').val(response.favFilm);
        $('#amazing-feat').val(response.amazingFeat);
        $('#can-share').val(response.canShare);
        $('#interests').val(response.interests);
        $('#countries-visited').val(JSON.parse(response.countriesVisited)).trigger('change');
        $('#countries-lived').val(JSON.parse(response.countriesLived)).trigger('change');

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

    // Select2
    $("select#countries-visited").select2();
    $("select#countries-lived").select2({
      allowClear: true
    });
  },
  componentDidMount: function() {

    this.refreshState();

  },
  render: function() {

    $('#user-edit-save').click(this.userEditSave);

    return (

      <div></div>

    )
  }
});
