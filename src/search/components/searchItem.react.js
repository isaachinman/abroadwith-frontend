var React = require('react');

var searchResultBgImage = {
  backgroundImage : 'url(' + 'https://a0.muscache.com/airbnb/static/landing_pages/pretzel/stills/paris-ac2c9c35b05b19e65af7c8eee89f2fae.jpg' + ')'
}

module.exports = React.createClass({
  render: function() {
    return (
      <div className='col s12 m6 l6'>
        <div className='search-result' style='{searchResultBgImage}'>
          <div className="card-image">
            <span className="card-title">Tandem</span>
          </div>
        </div>
      </div>
    );
  }
});
