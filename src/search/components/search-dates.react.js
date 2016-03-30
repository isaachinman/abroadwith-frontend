var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {
    $('#arrival').val(this.props.arrival);
    this.props.arrival < this.props.departure ? $('#departure').val(this.props.departure) : $('#departure').val('')
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
