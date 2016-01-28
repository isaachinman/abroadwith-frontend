var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {

    var caret = $('.collapsible-header i');
    $('.collapsible-header').click(function() {
      if (caret.hasClass('fa-caret-down')) {
        caret.removeClass('fa-caret-down');
        caret.addClass('fa-caret-up');
      } else if (caret.hasClass('fa-caret-up')) {
        caret.removeClass('fa-caret-up');
        caret.addClass('fa-caret-down');
      }
    })

  },
  render: function() {

    return (

      <div className='row no-margin'>
        <ul className="collapsible no-shadow no-margin" data-collapsible="accordion">
          <li>
            <div className="collapsible-header grey-text no-padding">
              <div className='container'>
                More filters <i className="fa fa-caret-down grey-text text-lighten-1"> </i>
              </div>
            </div>
            <div className="collapsible-body container">

              <div className='row section valign-wrapper'>

                <div className='col s1 valign center-align'>
                  <i className="fa fa-user fa-2x grey-text text-lighten-1"></i>
                </div>
                <div className='col s5'>
                  <select id='special-prefs' className='material' value={this.props.specialPrefs} multiple>
                    <option value="smoking">Smoking allowed</option>
                    <option value="pets">Pets allowed</option>
                    <option value="family">Family friendly</option>
                    <option value="wheelchair">Wheelchair accessible</option>
                  </select>
                </div>

                <div className='col s1 valign center-align'>
                  <i className="fa fa-cutlery fa-2x grey-text text-lighten-1"></i>
                </div>
                <div className='col s5'>
                  <select id='meal-plan' className='material' value={this.props.mealPlan}>
                    <option value="breakfast">Breakfast</option>
                    <option value="halfBoard">Half board</option>
                    <option value="fullBoard">Full board</option>
                  </select>
                </div>

              </div>

              <div className='divider'></div>

              <div className='row section valign-wrapper'>
                <div className='col s1 valign center-align'>
                  <i className="fa fa-asterisk fa-2x grey-text text-lighten-1"></i>
                </div>
                <div className='col s5'>
                  <select id='meal-pref' className='material' value={this.props.mealPref}>
                    <option value="">No meal preference</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="halal">Halal</option>
                    <option value="kosher">Kosher</option>
                  </select>
                </div>

                <div className='col s1 valign center-align'>
                  <i className="fa fa-exclamation-circle fa-2x grey-text text-lighten-1"></i>
                </div>
                <div className='col s5'>
                  <select id='diet-restrictions' className='material' value={this.props.dietRestrictions} multiple>
                    <option value="none" disabled>No dietary restrictions</option>
                    <option value="nutFree">Nut free</option>
                    <option value="lactoseFree">Lactose free</option>
                    <option value="glutenFree">Gluten free</option>
                    <option value="sugarFree">Sugar free</option>
                  </select>
                </div>
              </div>

              <div className='divider'></div>

              <div className='row section valign-wrapper'>
                <div className='col s1 valign center-align'>
                  <i className="fa fa-bed fa-2x grey-text text-lighten-1"></i>
                </div>
                <div className='col s5'>
                  <select id='amenities' className='material' value={this.props.amenities} multiple>
                    <option value="essentials" disabled>Essentials</option>
                    <option value="ac">Air conditioning</option>
                    <option value="airport">Airport pickup</option>
                    <option value="tv">TV</option>
                    <option value="cable">Cable</option>
                    <option value="washer">Washer</option>
                    <option value="pool">Pool</option>
                  </select>
                </div>
                <div className='col s1 valign center-align'>
                  <i className="fa fa-home fa-2x grey-text text-lighten-1"></i>
                </div>
                <div className='col s5'>
                  <select id='house-type' className='material' value={this.props.houseType} multiple>
                    <option value='all' disabled>All house types</option>
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="loft">Loft</option>
                    <option value="chalet">Chalet</option>
                    <option value="dorm">Dorm</option>
                    <option value="cabin">Cabin</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

            </div>
          </li>
        </ul>
      </div>

    );
  }
});
