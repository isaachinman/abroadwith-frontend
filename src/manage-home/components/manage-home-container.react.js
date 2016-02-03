var React =               require('react');
var BasicsTab =           require('./basics-tab.react');
var ImmersionsTab =       require('./immersions-tab.react');
var LocationTab =         require('./location-tab.react');
var DescriptionTab =      require('./description-tab.react');
var RoomsTab =            require('./rooms-tab.react');
var PhotosTab =           require('./photos-tab.react');
var PricingTab =          require('./pricing-tab.react');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      // state will be populated by GET
    }
  },
  componentDidMount: function() {

    console.log('mounted');

    // Language-known select
      $('select#language-sought').select2({
        placeholder: "Choose a language you want to learn"
      });

    // Set permanent vars
    var addLanguage = $('a#add-language');
    var chipContainer = $('#language-chips');
    var languageSought = $('#language-sought');

    addLanguage.click(function() {

      // Set conditional vars
      var languageCode = $('#language-sought option:selected').attr('data-lang');

      if (languageSought.val() != '' && $('.chip[data-lang="'+languageCode+'"]').length <= 0) {

        // Remove initial chip
        if ($('#language-chips').find($('.initial').length)) {
          $('#language-chips').find($('.initial')).remove();
        }

        var newLanguage = '<div class="language-chip chip" data-lang="' + languageCode + '">' + languageSought.val() + '<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

        languageSought.select2('val', '');
        languageSought.val('');
        discount.select2('val', '');

      }
    })

    // Home photos
    var photos = $('.home-photo');
    photos.find('.delete').click(function() {
      $(this).parentsUntil('.col').remove()
    })

    // Next button
    $('a#next-btn').click(function() {
      var activeTab = $('li.tab a.active');
      if (activeTab.attr('data-next')) {
        var next = activeTab.data('next');
        $('ul.tabs').tabs('select_tab', next);
        console.log('switched')
      }
    })

    $.get(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      var newState = {

        // Conditionally set up state per category
        basics:               response.basics ? response.basics : null,
        immersions:           response.immersions ? response.immersions : null,
        location:             response.location ? response.location : null,
        description:          response.description ? response.description : null,
        rooms:                response.rooms ? response.rooms : null,
        photos:               response.photos ? response.photos : null,
        pricing:              response.pricing ? response.pricing : null,

        // description
        summary:              response.description.summary,
        rules:                response.description.rules,
        neighbourhood:        response.description.neighbourhood,
        video:                response.description.video,

        // rooms
        rooms:                response.rooms,

        // photos
        photos:               response.photos,

        // pricing
        currency:             response.pricing.currency,
        oneMonthDiscount:     response.pricing.discounts.ONE_MONTH,
        threeMonthDiscount:   response.pricing.discounts.THREE_MONTH,
        sixMonthDiscount:     response.pricing.discounts.SIX_MONTH,
        extraGuest:           response.pricing.extras.EXTRA_GUEST,
        fullBoard:            response.pricing.extras.FULL_BOARD,
        halfBoard:            response.pricing.extras.HALF_BOARD,
        laundry:              response.pricing.extras.LAUNDRY,
        cleaning:             response.pricing.extras.CLEANING,
        airportPickup:        response.pricing.extras.AIRPORT_PICKUP

      }
      if (this.isMounted()) {
        this.setState(newState);
      }
      $('select.material').material_select();
    }.bind(this));
  },
  render: function() {
    return (

      <div>
        <div className="row manage-home">
          <div className="col s12 no-padding-sides">
            <ul className="tabs">
              <li className="tab"><a className='active' href="#basics" data-next='immersions'>Basics</a></li>
              <li className="tab"><a href="#immersions" data-next='location'>Immersions</a></li>
              <li id='location-tab' className="tab"><a href="#location" data-next='description'>Location</a></li>
              <li className="tab"><a href="#description" data-next='rooms'>Description</a></li>
              <li className="tab"><a href="#rooms" data-next='photos'>Rooms</a></li>
              <li className="tab"><a href="#photos" data-next='pricing'>Photos</a></li>
              <li className="tab"><a href="#pricing">Pricing</a></li>
            </ul>
          </div>

          <BasicsTab
            basics={this.state.basics}
          />

          <ImmersionsTab
            immersions={this.state.immersions}
          />

          <LocationTab
            street={this.state.street}
            complement={this.state.complement}
            zipCode={this.state.zipCode}
            state={this.state.state}
            city={this.state.city}
            country={this.state.country}
            lat={this.state.lat}
            lng={this.state.lng}
          />

          <DescriptionTab
            summary={this.state.summary}
            rules={this.state.rules}
            neighbourhood={this.state.neighbourhood}
            video={this.state.video}
          />

          <RoomsTab
            rooms={this.state.rooms}
          />

          <PhotosTab
            photos={this.state.photos}
          />

          <PricingTab
            currency={this.state.currency}
            oneMonthDiscount={this.state.oneMonthDiscount}
            threeMonthDiscount={this.state.threeMonthDiscount}
            sixMonthDiscount={this.state.sixMonthDiscount}
            extraGuest={this.state.extraGuest}
            fullBoard={this.state.fullBoard}
            halfBoard={this.state.halfBoard}
            laundry={this.state.laundry}
            cleaning={this.state.cleaning}
            airportPickup={this.state.airportPickup}
          />

        </div>

        <div className='row'>
          <div className='col s6 offset-s3'>
            <a className='btn btn-primary save-btn'>Save</a>
          </div>
          <div className='col s3 right-align'>
            <a id='next-btn'><i className="fa fa-chevron-right grey-text text-lighten-1 next-btn"></i></a>
          </div>
        </div>

        <div className='manage-home-info-text'>
          <h6>Now managing your home in Berlin</h6>
        </div>
      </div>

    );
  }
});
