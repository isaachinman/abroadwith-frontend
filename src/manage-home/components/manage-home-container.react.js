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

      window.homeObj = response;

      var newState = {

        // Conditionally set up state per category
        basics:               response.basics ? response.basics : null,
        immersions:           response.immersions ? response.immersions : null,
        location:             response.location ? response.location : null,
        description:          response.description ? response.description : null,
        rooms:                response.rooms ? response.rooms : null,
        photos:               response.photos ? response.photos : null,
        pricing:              response.pricing ? response.pricing : null,
        currency:             response.pricing ? response.pricing.currency : null

      }
      if (this.isMounted()) {
        this.setState(newState);
      }

    }.bind(this));
  },
  render: function() {
    return (

      <div>
        <div className="row manage-home">

          <BasicsTab
            basics={this.state.basics}
          />

          <ImmersionsTab
            immersions={this.state.immersions}
            currency={this.state.currency}
          />

          <LocationTab
            location={this.state.location}
          />

          <DescriptionTab
            description={this.state.description}
          />

          <RoomsTab
            rooms={this.state.rooms}
          />

          <PhotosTab
            photos={this.state.photos}
          />

          <PricingTab
            rooms={this.state.rooms}
            immersions={this.state.immersions}
            pricing={this.state.pricing}
          />

        </div>

      </div>

    );
  }
});
