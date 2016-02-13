var React = require('react');

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

    $.get(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      $('#user-photo').attr('src', response.profile.photo);
      $('#about-me').val(response.profile.aboutMe);
      $('#education').val(response.profile.education);
      $('#grew-up').val(response.profile.grewUp);
      $('#fav-book').val(response.profile.favBook);
      $('#fav-film').val(response.profile.favFilm);
      $('#amazing-feat').val(response.profile.amazingFeat);
      $('#can-share').val(response.profile.canShare);
      $('#interests').val(response.profile.interests);
      $('#countries-visited').val(response.profile.countriesVisited).trigger('change');
      $('#countries-lived').val(response.profile.countriesLived).trigger('change');

    }.bind(this));

    // Select2
    $("select#countries-visited").select2();
    $("select#countries-lived").select2();

  },
  render: function() {

    $('#user-edit-save').click(this.userEditSave);

    return (

      <div></div>

    )
  }
});
