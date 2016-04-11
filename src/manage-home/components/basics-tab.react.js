var React = require('react');

var i18n = require('../../global/util/i18n');
var toast = require('toast');

var domains = require('domains');
var JWT = require('JWT');

var refreshToken = require('refresh-token')

module.exports = React.createClass({
  saveBasics: function() {

    var newHomeObj = this.props.props;

    // Create new basics object
    newHomeObj.basics.homeType = $('#home-type').val();
    newHomeObj.basics.SAFETY = $('#safety').val();
    newHomeObj.basics.AMENITIES = $('#amenities').val();
    newHomeObj.basics.FOOD_OPTION = $('#food-option').val();
    newHomeObj.basics.EXTRAS = $('#extras').val();
    newHomeObj.basics.family = $('#family').prop('checked');
    newHomeObj.basics.PREFERENCES = $('#preferences').val();

    this.props.updateHome(newHomeObj, function() {
      toast(i18n.t('manage_home:basics_updated_toast'));
    });

  },
  componentDidMount: function() {
    $('a#save-basics').click(this.saveBasics);

    $('a#delete-home').click(function() {

      $('#preloader').show();

      $.ajax({
        url: domains.API + '/users/' + JWT.rid + '/homes/' + JWT.hid,
        type: 'DELETE',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
        },
        success: function(result) {

          refreshToken(function() {
            window.location = '/'
          });

        },
        error: function() {
          $('#preloader').hide();
        }
      });

    })

  },
  componentDidUpdate: function() {

    if (this.props.props.basics) {

      // Set input values
      $('#home-type').val(this.props.props.basics.homeType);
      $('#safety').val(this.props.props.basics.SAFETY)
      $('#amenities').val(this.props.props.basics.AMENITIES)
      $('#food-option').val(this.props.props.basics.FOOD_OPTION)
      $('#extras').val(this.props.props.basics.EXTRAS)
      $('#family').prop('checked', this.props.props.basics.family);
      $('#preferences').val(this.props.props.basics.PREFERENCES)

    }

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
