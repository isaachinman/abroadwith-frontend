var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {
    $('#arrival').val(this.props.arrival);
    $('#departure').val(this.props.departure);
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
