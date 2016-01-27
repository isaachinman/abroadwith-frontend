var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {

    var immersionSelect = $('#immersion');
    var tandemNodes = $('.tandem-language');

    immersionSelect.change(function() {
      if (immersionSelect.val() != null) {
        if (immersionSelect.val().indexOf('tandem') >= 0 && tandemNodes.hasClass('hide')) {
          $('.tandem-language').removeClass('hide');
        } else if (immersionSelect.val().indexOf('tandem') == -1 && !(tandemNodes.hasClass('hide'))) {
          $('.tandem-language').addClass('hide');
        }
      } else if (tandemNodes.hasClass('hide')) {
        $('.tandem-language').addClass('hide');
      }
    })

    $(function() {
      immersionSelect.change()
    })

  },
  render: function() {

    return (
      <div className='row section valign-wrapper tandem-language hide'>

        <div className='col s6 grey-text'>
          <div className='chip chip-grey'>Your tandem language(s)</div>
        </div>

        <div className='col s6'>
          <select id='language-teach' type='text' className="validate border-radius-left" value={this.props.tandem} multiple>
            <option></option>
            <option value='eng'>English</option>
            <option value='spa'>Spanish</option>
          </select>
        </div>

      </div>
    );
  }
});
