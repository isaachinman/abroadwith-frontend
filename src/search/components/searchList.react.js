var React = require('react');
var $ = require('jquery');
var SearchItem = require('./searchItem.react');
var SearchForm = require('./searchForm.react');

module.exports = React.createClass({
  loadSearchFromServer: function() {
    $.ajax({
      url: '/backend/search',
      type: 'GET',
      cache: false,
      success: function(data) {
        this.setState({data: JSON.parse(data).results});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/search', status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
	var searchNodes = this.state.data.map(function(item) {
	  return (
		<SearchItem name={item.name} price={item.price} type={item.type} currency={item.currency}>
		  Extra text.
		</SearchItem>
	  );
    });
    return (
      <div className="search">
        <SearchForm onSearch={this.loadSearchFromServer} />
        <h1>Search Results</h1>
        <div className="search__list">
		  {searchNodes}
		</div>
      </div>
    );
  }
});
