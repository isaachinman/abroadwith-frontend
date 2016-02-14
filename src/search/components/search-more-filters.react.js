var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {

    var caret = $('.collapsible-header i');
    $('.collapsible-header').click(function() {
      if (caret.hasClass('fa-caret-down')) {
        caret.removeClass('fa-caret-down');
        caret.addClass('fa-caret-up');
      } else if (caret.hasClass('fa-caret-up')) {
        caret.removeClass('fa-caret-up');
        caret.addClass('fa-caret-down');
      }
    })

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
