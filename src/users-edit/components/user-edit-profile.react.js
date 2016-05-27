const React = require('react');

const i18n = require('i18n')

const Dropzone = require('dropzone')
Dropzone.autoDiscover = false;

const domains = require('domains');
const toast = require('toast')

const JWT = require('JWT');
const GET = require('GET');
const POST = require('POST');

module.exports = React.createClass({
  userEditSave: function() {

    $('#preloader').show();

    delete userObj.paymentMethods;
    delete userObj.payoutMethods;
    delete userObj.verifications;
    delete userObj.email;

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

    var url = domains.API+'/users/'+JWT.rid;
    var success = function() {
      this.refreshState();
      toast(i18n.t('users:updated_toast'))
      $('#preloader').hide();
    }.bind(this)
    POST(url, userObj, success);

  },
  refreshState: function() {

    var url = domains.API+'/users/'+JWT.rid;
    var success = function(response) {

      window.userObj = response;

      response.photo !== null ? $('#user-photo').attr('src', domains.IMG + response.photo) : $('#user-photo').attr('src', domains.IMG + '/users/default.jpg');
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

      // Select2
      $("select#countries-visited").select2();
      $("select#countries-lived").select2();
      $('#interests').select2();

    };
    GET(url, success)



  },
  componentDidMount: function() {

    $('a#view-public-profile').attr('href', '/users/' + JWT.rid);
    this.refreshState();

    new Dropzone('#user-photo-upload', {
      url: '/upload/users/'+JWT.rid+'/photo',
      autoProcessQueue: true,
      method: 'post',
      headers: {'abroadauth': 'Bearer ' + localStorage.getItem('JWT')},
      maxFilesize: 10,
      acceptedFiles: 'image/jpeg,image/png',
      init: function() {
        this.on("success", function(file, serverResponse) {

          response = JSON.parse(serverResponse)

          $.each(response, function(index, obj) {
            userObj.photo = obj.location
          })

        });
      }
    })

  },
  render: function() {

    $('#user-edit-save').click(this.userEditSave);

    return (

      <div></div>

    )
  }
});
