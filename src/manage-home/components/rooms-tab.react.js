var React = require('react');

module.exports = React.createClass({
  render: function() {

    return (

      <div id="rooms" className="col s12 m10 offset-m1 l10 offset-l1">

        <div className='row'>
          <h4>Your available rooms</h4>
        </div>

        <ul className="collapsible rooms-collapsible" data-collapsible="accordion">
          <li className='white'>
            <div className="collapsible-header">
              New room
            </div>
            <div className="edit grey-text text-lighten-1">
              <i className="fa fa-plus-circle fa-2x"></i>
            </div>
            <div className="collapsible-body">

              <div className='row section'>
                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-tag fa-2x"></i>
                </div>
                <div className="col s10 m4 l4 input-field">
                  <input id="room-name" type="text" className="validate" placeholder='Eg. "Master bedroom"' length='35' />
                  <label htmlFor="room-name">Room name</label>
                </div>
                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-bed fa-2x"></i>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <select className='material' defaultValue=''>
                    <option value="" disabled>Choose a bed type</option>
                    <option value="airBed">Air bed</option>
                    <option value="futon">Futon</option>
                    <option value="pullOutSofa">Pull-out sofa</option>
                    <option value="couch">Couch</option>
                    <option value="singleBed">Single bed</option>
                    <option value="doubleBed">Double bed</option>
                  </select>
                  <label>Bed type</label>
                </div>
              </div>

              <div className='divider'></div>

              <div className='row section'>
                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-user-plus fa-2x"></i>
                </div>
                <div className='col s10 m4 l4 input-field'>
                  <select className='material' defaultValue=''>
                    <option value="" disabled>How many people?</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <label>Vacancies</label>
                </div>
                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-lock fa-2x"></i>
                </div>
                <div className='col s10 m6 l6 input-field'>
                  <select className='material' multiple defaultValue={[]}>
                    <option value="" disabled>What facilities does the room have?</option>
                    <option value="desk">Desk</option>
                    <option value="AC">Air conditioning</option>
                    <option value="dresser">Dresser</option>
                    <option value="bedsideLocker">Bedside locker</option>
                    <option value="wardrobe">Wardrobe</option>
                    <option value="heating">Heating</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="fridge">Fridge</option>
                    <option value="mirror">Mirror</option>
                    <option value="hangers">Hangers</option>
                    <option value="hairDryer">Hair Dryer</option>
                    <option value="iron">Iron</option>
                    <option value="doorLock">Door lock</option>
                  </select>
                  <label>Facilities</label>
                </div>
              </div>

              <div className='divider'></div>

              <div className='row section'>

                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-users fa-2x"></i>
                </div>
                <div className='col s5 m4 l4 left-align'>
                  <label>This is a shared room</label>
                  <div className="switch">
                    <label>
                      No
                      <input id='family' type="checkbox" />
                      <span className="lever"></span>
                      Yes
                    </label>
                  </div>
                </div>

                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-camera-retro fa-2x"></i>
                </div>
                <div className='col s10 m6 l6 left-align'>
                  <form action="#">
                    <div className="file-field input-field">
                      <div className="btn">
                        <span>
                          <small>Choose picture</small>
                        </span>
                        <input type="file" />
                      </div>
                      <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className='divider'></div>

              <div className='row section'>
                <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                  <i className="fa fa-file-text-o fa-2x"></i>
                </div>
                <div className="col s10 m11 l11 input-field">
                  <textarea id="room-description" className="materialize-textarea" length='127' placeholder='Tell guests about the room'></textarea>
                  <label htmlFor="room-description">Description</label>
                </div>
              </div>

              <div className='divider'></div>

              <div className='row section'>
                <div className='col s12'>
                  <a className='btn'>Add room</a>
                </div>
              </div>

            </div>
          </li>
        </ul>

        <div className='row'>

        </div>

        <ul className="collapsible rooms-collapsible" data-collapsible="accordion">
          <li>
            <div className="collapsible-header">
              Master bedroom
            </div>
            <div className="edit grey-text text-lighten-1">
              <i className="fa fa-pencil fa-2x"></i>
            </div>
            <div className="collapsible-body">

              Same form as above

            </div>
          </li>
          <li>
            <div className="collapsible-header">
              Kids room
            </div>
            <div className="edit grey-text text-lighten-1">
              <i className="fa fa-pencil fa-2x"></i>
            </div>
            <div className="collapsible-body">

              Same form as above

            </div>
          </li>
        </ul>

      </div>


    );
  }
});
