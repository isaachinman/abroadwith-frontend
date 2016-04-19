const React = require('react');

const i18n = require('i18n');
const toast = require('toast');

module.exports = React.createClass({
  saveDescription: function() {

    var newHomeObj = this.props.props;

    // Create new description object
    newHomeObj.description.summary = $('#summary').val();
    newHomeObj.description.rules = $('#rules').val();
    newHomeObj.description.neighbourhood = $('#neighbourhood').val();
    newHomeObj.description.video = $('#video').val() !== '' ? 'https://' + ($('#video').val()).replace(/.*?:\/\//g, "") : null;

    this.props.updateHome(newHomeObj, function() {
      toast(i18n.t('manage_home:description_updated_toast'));
    });

  },
  componentDidMount: function() {
    $('form#home-description-form').submit(function(e) {
      e.preventDefault();
      this.saveDescription();
    }.bind(this))
  },
  componentDidUpdate: function() {

    if (this.props.props.description) {
      $('#summary').val(this.props.props.description.summary);
      $('#rules').val(this.props.props.description.rules);
      $('#neighbourhood').val(this.props.props.description.neighbourhood);
      $('#video').val(this.props.props.description.video);
    }

  },
  render: function() {

    return (

      <div></div>

    );
  }
});
