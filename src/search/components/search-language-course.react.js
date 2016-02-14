var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {

    // Use switch to toggle disabled on course input
    var languageSwitch = $('input#language-switch');
    var languageSelect = $('select#language-school');

    languageSwitch.change(function() {
      if (languageSwitch.is(':checked') && languageSelect.prop('disabled', true)) {
        languageSelect.prop('disabled', false);
        languageSelect.material_select();
        $('.course-added').show();
      } else if (languageSwitch.not(':checked') && languageSelect.prop('disabled', false)) {
        languageSelect.prop('disabled', true);
        languageSelect.material_select();
        $('.course-added').hide();
      }
    })

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
