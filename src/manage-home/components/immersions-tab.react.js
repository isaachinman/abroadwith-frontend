var React = require('react');

module.exports = React.createClass({
  handleClick: function() {

    // Only proceed if at least one immersion is turned on
    if ($('.immersion-switch:checked').length > 0) {

      // Create new immersions object
      var newImmersionsObj = {};

      if ($('#stay-switch').is(':checked')) {

        // Compile stay object
        newImmersionsObj.stay = {};
        newImmersionsObj.stay.hours = $('#stay-hours').val();
        newImmersionsObj.stay.languagesOffered = $('#stay-languages-offered').val();

      }

      if ($('#tandem-switch').is(':checked')) {

        // Compile tandem object
        newImmersionsObj.tandem = {};
        newImmersionsObj.tandem.hours = $('#tandem-hours').val();
        newImmersionsObj.tandem.languagesOffered = $('#tandem-languages-offered');
        newImmersionsObj.tandem.languagesInterested = [];
        $('#language-chips .chip[data-lang]').each(function() {
          newImmersionsObj.tandem.languagesInterested.push($(this).attr('data-lang'))
        })

      }

      if ($('#teacher-switch').is(':checked')) {

        // Compile teacher object
        newImmersionsObj.teacher = {};
        newImmersionsObj.teacher.packages = $('#packages').val();
        newImmersionsObj.teacher.materials = $('#material-costs').val();
        newImmersionsObj.teacher.languagesOffered = $('#teacher-languages-offered').val();

      }

      // Modify home object, using new immersions object
      if (typeof homeObj !== 'undefined') {
        homeObj.immersions = newImmersionsObj;
        console.log(homeObj)
      }

      // POST new home object
      Materialize.toast('Immersions updated', 4000);

    }

  },
  render: function() {

    if (this.props.immersions) {

      // Stay vars
      if (this.props.immersions.stay) {
        var stayHours = this.props.immersions.stay.hours;
        var stayLanguagesOffered = this.props.immersions.stay.languagesOffered;
      }

      // Tandem vars
      if (this.props.immersions.tandem) {
        var tandemHours = this.props.immersions.tandem.hours;
        var tandemLanguagesOffered = this.props.immersions.tandem.languagesOffered;
        var tandemLanguagesInterested = this.props.immersions.tandem.languagesInterested;
      }

      if (typeof tandemLanguagesInterested === 'undefined') {
        var initialChip = <div className='chip initial'>Choose at least one<i className='material-icons'>close</i></div>
      } else {
        var interestedLanguageChips = tandemLanguagesInterested.map(function(lang) {
          return <div className='chip' data-lang={lang.lang} key={lang.lang}>{lang.lang}<i className='material-icons'>close</i></div>
        })
      }

      // Teacher vars
      if (this.props.immersions.teacher) {
        var teacherRate = this.props.immersions.teacher.hourly + this.props.currency;
        var teacherMaterialCost = this.props.immersions.teacher.materials + this.props.currency;
        var teacherPackages = this.props.immersions.teacher.packages;
        var teacherLanguagesOffered = this.props.immersions.teacher.languagesOffered;
      }

    }

    return (
      <div id="immersions" className="col s12 m10 offset-m1 l10 offset-l1">

        <div className='manage-home-block'>

          <div className='row'>
            <h4>What immersions do you want to offer?</h4>
          </div>

          <ul className="collapsible immersions-collapsible" data-collapsible="accordion">
            <li>
              <div className="collapsible-header">
                Stay
              </div>
              <div className="switch switch-absolute">
                <label>
                  No
                  <input id='stay-switch' type="checkbox" className='immersion-switch' />
                  <span className="lever"></span>
                  Yes
                </label>
              </div>
              <div className="collapsible-body">

                <div className='row section'>

                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-clock-o fa-2x"></i>
                  </div>
                  <div className='col s10 m4 l4 input-field'>
                    <select id='stay-hours' className='material' defaultValue='' value={stayHours}>
                      <option value="" disabled>Hours per week</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="14">15</option>
                      <option value="14">16</option>
                      <option value="14">17</option>
                      <option value="14">18</option>
                      <option value="14">19</option>
                      <option value="14">20</option>
                      <option value="14">21</option>
                    </select>
                    <label>Hours per week</label>
                  </div>

                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-language fa-2x"></i>
                  </div>
                  <div className='col s10 m6 l6 input-field'>
                    <select id='stay-languages-offered' className='material' multiple defaultValue={[]} value={stayLanguagesOffered}>
                      <option value="" disabled>Languages offered</option>
                      <option value="eng">English</option>
                      <option value="spa">Spanish</option>
                      <option value="por">Portuguese</option>
                      <option value="ger" disabled data-placeholder='German' data-content='<a className="btn tooltipped" data-position="bottom" data-delay="50" data-tooltip="I am tooltip">Hover me!</a>'>German</option>

                    </select>
                    <label>Languages offered</label>
                  </div>

                </div>

              </div>
            </li>
            <li>
              <div className="collapsible-header">
                Tandem
              </div>
              <div className="switch switch-absolute">
                <label>
                  No
                  <input id='tandem-switch' type="checkbox" className='immersion-switch' />
                  <span className="lever"></span>
                  Yes
                </label>
              </div>
              <div className="collapsible-body">

                <div className='row section'>
                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-clock-o fa-2x"></i>
                  </div>
                  <div className='col s10 m4 l4 input-field'>
                    <select id='tandem-hours' className='material' defaultValue='' value={tandemHours}>
                      <option value="" disabled>Hours per week</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="14">15</option>
                      <option value="14">16</option>
                      <option value="14">17</option>
                      <option value="14">18</option>
                      <option value="14">19</option>
                      <option value="14">20</option>
                      <option value="14">21</option>
                    </select>
                    <label>Hours per week</label>
                  </div>

                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-language fa-2x"></i>
                  </div>
                  <div className='col s10 m6 l6 input-field'>
                    <select id='tandem-languages-offered' className='material' multiple defaultValue={[]} value={tandemLanguagesOffered}>
                      <option value="" disabled>Languages offered</option>
                      <option value="eng">English</option>
                      <option value="spa">Spanish</option>
                      <option value="por">Portuguese</option>
                      <option value="ger" disabled data-placeholder='German' data-content='<a className="btn tooltipped" data-position="bottom" data-delay="50" data-tooltip="I am tooltip">Hover me!</a>'>German</option>
                    </select>
                    <label>Languages offered</label>
                  </div>

                </div>

                <div className='divider'></div>

                <div className='row section'>

                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-eye fa-2x"></i>
                  </div>
                  <div className='col s10 m4 l4 input-field'>
                    <select id="language-sought" type="text" className="validate no-margin">
                      <option></option>
                      <option data-lang='eng'>English</option>
                      <option data-lang='por'>Portuguese</option>
                      <option data-lang='spa'>Spanish</option>
                      <option data-lang='ger'>German</option>
                      <option data-lang='kor'>Korean</option>
                    </select>
                    <label className='active'>Language(s) sought</label>
                  </div>

                  <div className='col s2 m1 l1 input-field'>
                    <a id='add-language' className='btn-floating'>+</a>
                  </div>
                  <div className='col s2 m6 l6 input-field left-align'>

                    <div id='language-chips'>
                      {initialChip}
                      {interestedLanguageChips}
                    </div>
                  </div>

                </div>

              </div>
            </li>
            <li>
              <div className="collapsible-header">
                Teacher stay
              </div>
              <div className="switch switch-absolute">
                <label>
                  No
                  <input id='teacher-switch' type="checkbox" className='immersion-switch' />
                  <span className="lever"></span>
                  Yes
                </label>
              </div>
              <div className="collapsible-body">

                <div className='row section'>

                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-clock-o fa-2x"></i>
                  </div>
                  <div className='col s10 m5 l5 input-field'>
                    <select id='packages' className='material' multiple defaultValue={[]} value={teacherPackages}>
                      <option value="" disabled>Packages offered</option>
                      <option value="5">5hrs/week</option>
                      <option value="10">10hrs/week</option>
                      <option value="15">15hrs/week</option>
                    </select>
                    <label>Packages offered</label>
                  </div>

                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-hourglass-half fa-2x"></i>
                  </div>
                  <div className='col s10 m2 l2 input-field'>
                    <input id='teacher-rate' type="text" className="validate no-margin" placeholder='€15' value={teacherRate} />
                    <label className='active'>Hourly rate</label>
                  </div>

                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-money fa-2x"></i>
                  </div>
                  <div className='col s10 m2 l2 input-field'>
                    <input id='material-costs' type="text" className="validate no-margin" placeholder='€25' value={teacherMaterialCost} />
                    <label className='active'>Material costs</label>
                  </div>

                </div>

                <div className='divider'></div>

                <div className='row section'>
                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-language fa-2x"></i>
                  </div>
                  <div className='col s10 m5 l5'>
                    <select id='teacher-languages-offered' className='material' multiple defaultValue={[]} value={teacherLanguagesOffered} >
                      <option value="" disabled>Languages offered</option>
                      <option value="eng">English</option>
                      <option value="spa">Spanish</option>
                      <option value="por">Portuguese</option>
                      <option value="ger" disabled data-placeholder='German' data-content='<a className="btn tooltipped" data-position="bottom" data-delay="50" data-tooltip="I am tooltip">Hover me!</a>'>German</option>

                    </select>
                    <label>Languages offered</label>
                  </div>

                  <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                    <i className="fa fa-graduation-cap fa-2x"></i>
                  </div>
                  <div className='col s10 m5 l5'>
                    <form action="#">
                      <div className="file-field input-field">
                        <div className="btn">
                          <span><small>Upload certification</small></span>
                          <input type="file" />
                        </div>
                        <div className="file-path-wrapper">
                          <input className="file-path validate" type="text" />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </li>
          </ul>

        </div>

        <div className='row'>
          <div className='col s6 offset-s3'>
            <a id='immersions-save' className='btn btn-primary save-btn' onClick={this.handleClick}>Save</a>
          </div>
          <div className='col s3 right-align'>
            <a><i className="fa fa-chevron-right grey-text text-lighten-1 next-btn"></i></a>
          </div>
        </div>

      </div>

    );
  }
});
