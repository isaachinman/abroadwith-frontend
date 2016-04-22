var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {
    $('#language').val(this.props.language);
    console.log(this.props.immersions)
    $('#immersions').val(this.props.immersions);
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
