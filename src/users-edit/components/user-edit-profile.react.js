var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {

    console.log('mounted')

    $.get(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      $('#user-photo').attr('src', response.profile.photo);
      $('#about-me').html(response.profile.aboutMe);
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

    return (

      <div></div>

    )
  }
});
