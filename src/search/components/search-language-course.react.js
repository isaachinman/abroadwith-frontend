var React = require('react');

module.exports = React.createClass({
  languageToggle: function() {
    // Use switch to toggle disabled on course input
    var languageSwitch = $('input#language-switch');
    var languageSelect = $('select#language-school');

    $(document).ready(function() {
      if (languageSwitch.is(':checked') && languageSelect.prop('disabled', true)) {
        languageSelect.prop('disabled', false);
        languageSelect.material_select();
        setTimeout(function() {
          $('.course-added').show();
        }, 500)
        console.log('show courses')
      } else if (languageSwitch.not(':checked') && languageSelect.prop('disabled', false)) {
        languageSelect.prop('disabled', true);
        languageSelect.material_select();
        $('.course-added').hide();
        console.log('hide courses')
      }
    });

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
