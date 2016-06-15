var React = require('react')
var i18n = require('i18n')

module.exports = React.createClass({
  render: function() {
    return (

      <div id='results' className='row section white relative center-align'>

        <div className='col s12 margin-top-20'>
          <i className="fa fa-ban fa-5x big-email-icon"></i>
        </div>

        <div className='col s10 offset-s1 margin-top-50 large'>
          {i18n.t('search:no_results_found')}
        </div>

      </div>

    );
  }
});
