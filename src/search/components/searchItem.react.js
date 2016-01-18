var React = require('react');

var searchResultBgImage = {
  backgroundImage : 'url(' + 'https://a0.muscache.com/airbnb/static/landing_pages/pretzel/stills/paris-ac2c9c35b05b19e65af7c8eee89f2fae.jpg' + ')'
}

module.exports = React.createClass({
  render: function() {
    return (
      <div class='col s12 m6 l6'>
        <div class='search-result' style='{searchResultBgImage}'>
          <div class="card-image">
            <span class="card-title">Tandem</span>
          </div>
        </div>
      </div>
    );
  }
});
