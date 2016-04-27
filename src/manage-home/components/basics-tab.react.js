const React = require('react');

const i18n = require('i18n');
const toast = require('toast');

const domains = require('domains');
const JWT = require('JWT');

const refreshToken = require('refresh-token')

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

    $('form#home-basics-form').submit(function(e){
      e.preventDefault();
      this.saveBasics();
    }.bind(this))

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
