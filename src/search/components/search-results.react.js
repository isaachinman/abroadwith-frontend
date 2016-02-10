var React = require('react');
var IndividualResult = require('./search-individual-result.react');

module.exports = React.createClass({
  handleClick: function() {

  },
  render: function() {

    var results = [];

    console.log(this.props.results)

    if (this.props.results) {

      this.props.results.forEach(function(obj) {
        var result = <IndividualResult
          />;
        results.push(result);
      })

    } else {
      rooms = <li className='white'><div id='name' className="collapsible-header">Your rooms will appear here</div><div className="edit grey-text text-lighten-1"></div></li>
    }

    return (

      <div className='row section white relative'>

        {results}

      </div>

    );
  }
});
