var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {
    $('#language').val(this.props.language);
    $('#immersions').val(this.props.immersions);
    $('#immersions').material_select();
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
