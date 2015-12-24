var React = require('react');

module.exports = React.createClass({
  handleSubmit: function(e) {
    this.props.onSearch('');
  },
  render: function() {
    return (
      <div className="search__form" >
        <input type="submit" value="Get" onClick={this.handleSubmit}/>
      </div>
    );
  }
});