var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div id="immersions" className="col s12 m10 offset-m1 l10 offset-l1">

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
                <input type="checkbox" className='immersion-switch' />
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
                  <select className='material' defaultValue=''>
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
                  <select className='material' multiple defaultValue={[]}>
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
                <input type="checkbox" className='immersion-switch' />
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
                  <select className='material' defaultValue=''>
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
                  <select className='material' multiple defaultValue={[]}>
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
                    <div className='chip initial'>
                      Choose one
                      <i className="material-icons">close</i>
                    </div>

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
                <input type="checkbox" className='immersion-switch' />
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
                  <select className='material' multiple defaultValue={[]}>
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
                  <input type="text" className="validate no-margin" placeholder='€15'/>
                  <label className='active'>Hourly rate</label>
                </div>

                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-money fa-2x"></i>
                </div>
                <div className='col s10 m2 l2 input-field'>
                  <input type="text" className="validate no-margin" placeholder='€25'/>
                  <label className='active'>Material costs</label>
                </div>

              </div>

              <div className='divider'></div>

              <div className='row section'>
                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-language fa-2x"></i>
                </div>
                <div className='col s10 m5 l5'>
                  <select className='material' multiple defaultValue={[]}>
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

    );
  }
});
