var React =               require('react');
var BasicsTab =           require('./basics-tab.react');
var ImmersionsTab =       require('./immersions-tab.react');
var LocationTab =         require('./location-tab.react');
var DescriptionTab =      require('./description-tab.react');
var RoomsTab =            require('./rooms-tab.react');
var PhotosTab =           require('./photos-tab.react');
var PricingTab =          require('./pricing-tab.react');

var toast = require('toast');

var domains = require('domains');
var JWT = require('JWT');
var GET = require('GET');
var POST = require('POST');

var i18n = require('../../global/util/i18n');

module.exports = React.createClass({
  updateHome: function(newHomeObj, callback){

    $('#preloader').show();

    delete homeObj.GENERAL;
    var updateHome = this.updateHome;

    var url = domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid;
    var success = function(response) {

      console.log('response:' +response)

      $('#preloader').hide();

      this.refreshState();

      callback();

    }.bind(this)
    POST(url, homeObj, success);

  },
  componentDidMount: function() {

    // Home photos
    var photos = $('.home-photo');
    photos.find('.delete').click(function() {
      $(this).parentsUntil('.col').remove()
    })

    // Next tab button
    $('a.next-btn').click(function() {
      $('.button-group li.active').next().trigger('mouseup');
    })

    var refresh = this.refreshState;

    $("#home_upload_photos_button").click(function()
    {
        $('#home_upload_photos').each(function(index, value)
        {
            var file = value.files;
            if(file)
            {
                var formData = new FormData();
                var token = JSON.parse(atob(localStorage.getItem('JWT').split('.')[1]));
                for(var f = 0; f < file.length; f++){
                  formData.append('photos', file[f]);
                }
                $('#preloader').show();
                $.ajax({
                  url : '/upload/users/'+token.rid+'/homes/'+token.hid+'/photos',
                  type : 'POST',
                  data : formData,
                  cache : false,
                  contentType : false,
                  processData : false,
                  beforeSend: function(xhr){xhr.setRequestHeader('abroadauth', 'Bearer ' + localStorage.getItem('JWT'))},
                  success : function(data, textStatus, jqXHR) {
                        toast('Images uploaded');
                        refresh();
                        $('#preloader').hide();
                  },
                  error: function(jqXHR) {
                    var message = jqXHR.responseText;
                    toast('Failed: '+ message);
                    $('#preloader').hide();
                  }
                });
            }
        });
    });

    this.refreshState();

  },
  refreshState: function() {

    $('input').off();

    var url = domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid;
    var success = function(response) {

      console.log(response)

      // Update status bar
      var publishedBar = $('#published-status');
      if (response.homeActivationResponse.activated === false) {

        // If home is active, swap classes and text of publishedBar
        publishedBar.addClass('manage-home-info-text--unpublished');
        publishedBar.html(i18n.t('manage_home:message_bottom_unpublished') + ' (' + i18n.t('homes:published_codes.'+response.homeActivationResponse.code) + ')');

      } else if (response.homeActivationResponse.activated === true) {

        // If home is inactive, swap classes and text of publishedBar
        publishedBar.addClass('manage-home-info-text--published');
        publishedBar.html('<span class="hide-on-med-and-down">' + i18n.t('homes:published_codes.'+response.homeActivationResponse.code) + '</span>' + ' (' + '<a id="unpublish-home">Click here to unpublish</a>' + ')' + '<a href="/homes/' + JWT.hid + '" class="btn btn-flat btn-secondary hide-on-small-and-down">View profile</a>');

        // If home is active, create an unpublish function
        $('a#unpublish-home').click(function() {
          homeObj.immersions.stay.isActive = false;
          homeObj.immersions.tandem.isActive = false;
          homeObj.immersions.teacher.isActive = false;
          this.updateHome(function() {
            toast('Home deactivated')
          });
        }.bind(this))

      }

      window.homeObj = response;

      var newState = {

        // Conditionally set up state per category
        published:                       response.isActive,
        basics:                          response.basics ? response.basics : null,
        immersions:                      response.immersions ? response.immersions : null,
        location:                        response.location ? response.location : null,
        description:                     response.description ? response.description : null,
        rooms:                           response.rooms ? response.rooms : null,
        photos:                          response.photos ? response.photos : null,
        pricing:                         response.pricing ? response.pricing : null,
        currency:                        response.pricing ? response.pricing.currency : null,
        stayAvailableLanguages:          response.stayAvailableLanguages ? response.stayAvailableLanguages : null,
        tandemAvailableLanguages:        response.tandemAvailableLanguages ? response.tandemAvailableLanguages : null,
        tandemAvailableLearnLanguages:   response.tandemAvailableLearnLanguages ? response.tandemAvailableLearnLanguages : null,
        teacherAvailableLanguages:       response.teacherAvailableLanguages ? response.teacherAvailableLanguages : null

      }

      this.setState(newState);

      // Refresh selects
      $('select.material').material_select();

    }.bind(this);
    GET(url, success)

  },
  render: function() {
    return (

      <div>

        <BasicsTab
          updateHome={this.updateHome}
          basics={this.state.basics}
        />

        <ImmersionsTab
          updateHome={this.updateHome}
          immersions={this.state.immersions}
          stayAvailableLanguages={this.state.stayAvailableLanguages}
          tandemAvailableLanguages={this.state.tandemAvailableLanguages}
          tandemAvailableLearnLanguages={this.state.tandemAvailableLearnLanguages}
          teacherAvailableLanguages={this.state.teacherAvailableLanguages}
          currency={this.state.currency}
        />

        <LocationTab
          updateHome={this.updateHome}
          location={this.state.location}
        />

        <DescriptionTab
          updateHome={this.updateHome}
          description={this.state.description}
        />

        <RoomsTab
          updateHome={this.updateHome}
          refreshState={this.refreshState}
          rooms={this.state.rooms}
        />

        <PhotosTab
          updateHome={this.updateHome}
          refreshState={this.refreshState}
          photos={this.state.photos}
        />

        <PricingTab
          updateHome={this.updateHome}
          rooms={this.state.rooms}
          immersions={this.state.immersions}
          pricing={this.state.pricing}
        />

      </div>

    );
  }
});
