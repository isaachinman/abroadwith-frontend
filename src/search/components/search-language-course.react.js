var React = require('react');

module.exports = React.createClass({
  languageToggle: function() {
    // Use switch to toggle disabled on course input
    var languageSwitch = $('input#language-switch');
    var languageSelect = $('select#language-school');

    if (languageSwitch.is(':checked') && languageSelect.prop('disabled', true)) {
      languageSelect.prop('disabled', false);
      setTimeout(function() {
        $('.course-added').show();
      }, 10)
      console.log('show courses')
    } else if (languageSwitch.not(':checked') && languageSelect.prop('disabled', false)) {
      languageSelect.prop('disabled', true);
      $('.course-added').hide();
    }

    languageSelect.material_select();

  },
  componentDidUpdate: function() {

    this.languageToggle();

  },
  componentDidMount: function() {

    this.languageToggle();

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
