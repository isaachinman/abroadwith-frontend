var React = require('react');

var domains = require('domains');
var JWT = require('JWT');
var GET = require('GET');
var POST = require('POST');

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

    console.log(userObj);

    var url = domains.API+'/users/'+JWT.rid;
    var success = function() {
      this.refreshState()
    }.bind(this)
    POST(url, userObj, success);

  },
  refreshState: function() {

    var url = domains.API+'/users/'+JWT.rid;
    var success = function(response) {

      window.userObj = response;

      console.log(response)

      $('#user-photo').attr('src', domains.IMG + response.photo);
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

    };
    GET(url, success)

    // Select2
    $("select#countries-visited").select2();
    $("select#countries-lived").select2({
      allowClear: true
    });

  },
  componentDidMount: function() {

    $('a#view-public-profile').attr('href', '/users/' + JWT.rid)
    this.refreshState();

  },
  render: function() {

    $('#user-edit-save').click(this.userEditSave);

    return (

      <div></div>

    )
  }
});
