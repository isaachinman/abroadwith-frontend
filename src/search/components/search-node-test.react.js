var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1>{this.props.minPrice}</h1>
      </div>
    );
  }
});
