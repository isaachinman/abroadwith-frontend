var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {
    console.log('update')
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
