var React = require('react');
var toast = require('toast');

var domains = require('domains');
var jwt_decode = require('jwt-decode');

var refreshToken = require('refresh-token');

module.exports = React.createClass({
  saveBasics: function() {

    // Create new basics object
    homeObj.basics.homeType = $('#home-type').val();
    homeObj.basics.SAFETY = $('#safety').val();
    homeObj.basics.AMENITIES = $('#amenities').val();
    homeObj.basics.FOOD_OPTION = $('#food-option').val();
    homeObj.basics.EXTRAS = $('#extras').val();
    homeObj.basics.family = $('#family').prop('checked');
    homeObj.basics.PREFERENCES = $('#preferences').val();

    this.props.updateHome(function() {
      toast('Basics updated');
    });

  },
  componentDidMount: function() {
    $('a#save-basics').click(this.saveBasics);

    $('a#delete-home').click(function() {

      var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
      $.ajax({
        url: domains.API + '/users/' + JWT.rid + '/homes/' + JWT.hid,
        type: 'DELETE',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
        },
        success: function(result) {

          refreshToken(goToHome);

          function goToHome() {
            window.location = '/'
          }

        }
      });

    })

  },
  componentDidUpdate: function() {

    if (this.props.basics) {

      // Set input values
      $('#home-type').val(this.props.basics.homeType);
      $('#safety').val(this.props.basics.SAFETY)
      $('#amenities').val(this.props.basics.AMENITIES)
      $('#food-option').val(this.props.basics.FOOD_OPTION)
      $('#extras').val(this.props.basics.EXTRAS)
      $('#family').prop('checked', this.props.basics.family);
      $('#preferences').val(this.props.basics.PREFERENCES)

    }

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
