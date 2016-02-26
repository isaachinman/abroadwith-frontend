var React =               require('react');
var BasicsTab =           require('./basics-tab.react');
var ImmersionsTab =       require('./immersions-tab.react');
var LocationTab =         require('./location-tab.react');
var DescriptionTab =      require('./description-tab.react');
var RoomsTab =            require('./rooms-tab.react');
var PhotosTab =           require('./photos-tab.react');
var PricingTab =          require('./pricing-tab.react');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['manage_home']);

var jwt_decode = require('jwt-decode');
var domains = require('domains');

module.exports = React.createClass({
  updateHome: function(){

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    console.log(homeObj)

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid,
      type: "POST",
      data: JSON.stringify(homeObj),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        this.refreshState();

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

    // POST new home object
    Materialize.toast('Basics updated', 4000);

  },
  componentDidMount: function() {

    // Home photos
    var photos = $('.home-photo');
    photos.find('.delete').click(function() {
      $(this).parentsUntil('.col').remove()
    })

    // Next button
    $('a.next-btn').click(function() {
      var activeTab = $('li.tab a.active');
      if (activeTab.attr('data-next')) {
        var next = activeTab.data('next');
        $('ul.tabs').tabs('select_tab', next);
      }
    })

    this.refreshState();

  },
  refreshState: function() {
    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid,
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        console.log(response)

        window.homeObj = response;

        var newState = {

          // Conditionally set up state per category
          published:            response.isActive,
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

        // Refresh selects
        $('select.material').material_select();

        // Update status bar
        var publishedBar = $('#published-status');
        if (this.state.published === false) {
          publishedBar.addClass('manage-home-info-text--unpublished');
          publishedBar.html(i18n.t('manage_home:message_bottom_unpublished'));
        } else if (this.state.published === true) {
          publishedBar.addClass('manage-home-info-text--published');
          publishedBar.html(i18n.t('manage_home:message_bottom_published'));
        }

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  render: function() {
    return (

      <div>

          <BasicsTab
            updateHome={this.updateHome}
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
            refreshState={this.props.refreshState}
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

    );
  }
});
