var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {

    // Use switch to toggle disabled on course input
    var languageSwitch = $('input#language-switch');
    var languageSelect = $('select#language-school');
    var courseFees = $('.price').find('.course-added');

    languageSwitch.change(function() {
      if (languageSwitch.is(':checked') && languageSelect.prop('disabled', true)) {
        languageSelect.prop('disabled', false);
        languageSelect.material_select();
        courseFees.show();
      } else if (languageSwitch.not(':checked') && languageSelect.prop('disabled', false)) {
        languageSelect.prop('disabled', true);
        languageSelect.material_select();
        courseFees.hide();
      }
    })

    languageSwitch.change();

  },
  render: function() {

    var toggle;
    if (this.props.language !== null) {
      toggle = <input id='language-switch' type="checkbox" defaultChecked='checked' />
    } else {
      toggle = <input id='language-switch' type="checkbox" defaultChecked='checked' />
    }

    return (
      <div className='row section valign-wrapper'>
        <div className='col s5 grey-text'>
          <div className='chip chip-grey'>Add a language course</div>
        </div>
        <div className='col s3'>
          <div className="switch">
            <label>
              No
              {toggle}
              <span className="lever"></span>
              Yes
            </label>
          </div>
        </div>
        <div className='col s4'>
          <select id='language-school' className='material' disabled value={this.props.course}>
            <option value="a1">English A1</option>
            <option value="a2">English A2</option>
            <option value="b1">English B1</option>
            <option value="b2">English B2</option>
            <option value="c1">English C1</option>
            <option value="c2">English C2</option>
          </select>
        </div>
      </div>
    );
  }
});
