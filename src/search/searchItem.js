var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="search__item">
        <h2 className="search__item_name">
          {this.props.name}
        </h2>
		<h3 className="search__item_type">
          {this.props.type}
        </h3>
		<h3 className="search__item_price">
          {this.props.price} {this.props.currency}
        </h3>
      </div>
    );
  }
});