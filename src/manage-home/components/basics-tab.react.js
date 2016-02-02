var React = require('react');

module.exports = React.createClass({
  render: function() {

    return (
      <div id="basics" className="col s12 m10 offset-m1 l10 offset-l1">

        <div className='row'>
          <h4>Tell us about your home</h4>
        </div>

        <div className='manage-home-section'>

          <div className='row section'>
            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-home fa-2x"></i>
            </div>
            <div className='col s10 m2 l2 input-field'>
              <select className='material' defaultValue=''>
                <option value="" disabled>House type</option>
                <option value="flat">Flat</option>
                <option value="house">House</option>
                <option value="loft">Loft</option>
                <option value="cabin">Cabin</option>
                <option value="dorm">Dorm</option>
                <option value="chalet">Chalet</option>
                <option value="other">Other</option>
              </select>
              <label>House type</label>
            </div>


            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-life-ring fa-2x"></i>
            </div>
            <div className='col s10 m3 l3 input-field'>
              <select className='material' multiple defaultValue={[]}>
                <option value="" disabled>House safety</option>
                <option value="firstAid">First aid</option>
                <option value="fireExtinguisher">Fire extinguisher</option>
                <option value="safetyCard">Safety card</option>
              </select>
              <label>House safety</label>
            </div>

            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-wifi fa-2x"></i>
            </div>
            <div className='col s10 m4 l4 input-field'>

              <select className='material' multiple defaultValue={[]}>
                <option value="" disabled>Amenities</option>
                <option value="essentials">Essentials</option>
                <option value="tv">TV</option>
                <option value="cable">Cable TV</option>
                <option value="ac">Air conditioning</option>
                <option value="heating">Heating</option>
                <option value="sharedKitchen">Shared kitchen</option>
                <option value="internet">Internet</option>
                <option value="wifi">Wifi</option>
              </select>
              <label>Amenities</label>

            </div>
          </div>

          <div className='divider'></div>

          <div className='row section'>

            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-cutlery fa-2x"></i>
            </div>
            <div className='col s10 m2 l2 input-field'>
              <select className='material' multiple defaultValue={['breakfast']}>
                <option value="breakfast" disabled>Breakfast</option>
                <option value="halfBoard">Half board</option>
                <option value="fullBoard">Full board</option>
              </select>
              <label>Menus offered</label>
            </div>

            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-asterisk fa-2x"></i>
            </div>
            <div className='col s10 m3 l3 input-field'>
              <select className='material' multiple defaultValue={[]}>
                <option value="" disabled>Choose your offered diets</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
                <option value="diabetic">Diabetic</option>
                <option value="glutenFree">Gluten free</option>
                <option value="lactoseIntolerant">Lactose intolerant</option>
                <option value="nutAllergy">Nut allergy</option>
              </select>
              <label>Diets offered</label>
            </div>

            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-fire fa-2x"></i>
            </div>
            <div className='col s10 m4 l4 input-field'>
              <select className='material' multiple defaultValue={[]}>
                <option value="" disabled>Choose your extras</option>
                <option value="hotTub">Hot tub</option>
                <option value="washer">Washer</option>
                <option value="pool">Pool</option>
                <option value="dryer">Dryer</option>
                <option value="freeParking">Free parking nearby</option>
                <option value="gym">Gym</option>
                <option value="elevator">Elevator in building</option>
                <option value="fireplace">Indoor fireplace</option>
              </select>
              <label>Extras</label>

            </div>
          </div>

          <div className='divider'></div>

          <div className='row section'>

            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-users fa-2x"></i>
            </div>
            <div className='col s5 m2 l2 left-align'>
              <label>This is a family home</label>
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
              <i className="fa fa-user fa-2x"></i>
            </div>
            <div className='col s8 m6 l8 input-field'>
              <select className='material' multiple defaultValue={[]}>
                <option value="" disabled>Choose your lifestyle preferences</option>
                <option value="smokingAllowed">Smoking allowed</option>
                <option value="petsAllowed">Pets allowed</option>
                <option value="petsLiveHere">Pets live in the house</option>
                <option value="wheelchairAccessible">Wheelchair accessible</option>
                <option value="familyFriendly">Family friendly</option>
              </select>
              <label>Lifestyle preferences</label>
            </div>

          </div>

        </div>

      </div>
    );
  }
});
