var React = require('react');

module.exports = React.createClass({
  immersionsChanged: function() {
    var immersionSelect = $('#immersions');
    var tandemNodes = $('.tandem-language');
    if (immersionSelect.val() != null) {
      if (immersionSelect.val().indexOf('tandem') >= 0 && tandemNodes.hasClass('hide')) {
        tandemNodes.removeClass('hide');
      } else if (immersionSelect.val().indexOf('tandem') == -1 && !(tandemNodes.hasClass('hide'))) {
        tandemNodes.addClass('hide');
      }
    } else if (tandemNodes.hasClass('hide')) {
      tandemNodes.addClass('hide');
    }
  },
  componentDidUpdate: function() {
    this.immersionsChanged();
  },
  componentDidMount: function() {

    $('#immersions').change(this.immersionsChanged);

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
