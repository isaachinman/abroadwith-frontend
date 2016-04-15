var React =               require('react');
var BasicsTab =           require('./basics-tab.react');
var ImmersionsTab =       require('./immersions-tab.react');
var LocationTab =         require('./location-tab.react');
var DescriptionTab =      require('./description-tab.react');
var RoomsTab =            require('./rooms-tab.react');
var PhotosTab =           require('./photos-tab.react');
var PricingTab =          require('./pricing-tab.react');

var homeStatusCodes =     require('home-status-codes');

var toast = require('toast');
var isOnScreen = require('is-on-screen');

var domains = require('domains');
var JWT = require('JWT');
var GET = require('GET');
var POST = require('POST');

var i18n = require('../../global/util/i18n');

module.exports = React.createClass({
  updateHome: function(newHomeObj, callback){

    $('#preloader').show();

    delete newHomeObj.published;
    delete newHomeObj.GENERAL;

    var url = domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid;
    var success = function(response) {

      $('#preloader').hide();
      this.refreshState();
      callback();

    }.bind(this)
    POST(url, newHomeObj, success);

  },
  componentDidMount: function() {

    $('.step').click(function() {
      $('.step.active').removeClass('active');
      $(this).addClass('active');
      var target = $(this).attr('id');
      $('.tab').hide();
      $('#'+target+'-tab').show();
    })

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
                        toast(i18n.t('manage_home:images_uploaded_toast'));
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

    $('#preloader').show();

    $('input').off();

    var url = domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid;
    var success = function(response) {

      console.log(response)

      // response.homeActivationResponse.code = 'AT_LEAST_ONE_STAY_REQUIRED';

      if (response.homeActivationResponse.code === 'ACTIVATED') {

        // Reset step classes
        $('.ui.steps .step').attr('class', 'step');

        // Home is active
        $('#success').addClass('active');
        $('#success').prevAll().addClass('completed');

        // Show success tab
        $('.tab').hide();
        $('#success-tab').show();
        
        // Save buttons should say next
        $('.save-btn').html('Save');

        // If active step is not visible, scroll to it
        if ($('#success').isOnScreen() === false) {
          $('.ui.steps').animate({
            scrollLeft: $('#success').position().left
          })
        }

        // All steps are clickable
        $('.step').addClass('link');

        // Set up the success page
        $('#home-published-image').attr('src',domains.IMG+response.photos[0]);
        $('#home-published-view').attr('href','/homes/'+JWT.hid);

      } else {

        // Home is not active

        // Determine which step is active
        for (var step in homeStatusCodes) {
          for (var code in homeStatusCodes[step]) {
            if (homeStatusCodes[step][code] === response.homeActivationResponse.code) {
              var activeStep = step;
            }
          }
        }

        // Save buttons should say next
        $('.save-btn').html('Next')

        // Reset step classes
        $('.ui.steps .step').attr('class', 'step');

        // Adjust steps to reflect active step
        $('#'+activeStep).prevAll().addClass('completed');
        $('#'+activeStep).prevAll().addClass('link');
        $('#'+activeStep).addClass('active');
        $('#'+activeStep).addClass('link');
        $('#'+activeStep).nextAll().addClass('disabled');

        // If active step is not visible, scroll to it
        if ($('#'+activeStep).isOnScreen() === false) {
          $('.ui.steps').animate({
            scrollLeft: $('#'+activeStep).position().left
          })
        }

        // Show current tab
        $('.tab').hide();
        $('#'+activeStep+'-tab').show();

      }

      console.log(activeStep)

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
        stayAvailableLanguages:          response.stayAvailableLanguages ? response.stayAvailableLanguages : null,
        tandemAvailableLanguages:        response.tandemAvailableLanguages ? response.tandemAvailableLanguages : null,
        tandemAvailableLearnLanguages:   response.tandemAvailableLearnLanguages ? response.tandemAvailableLearnLanguages : null,
        teacherAvailableLanguages:       response.teacherAvailableLanguages ? response.teacherAvailableLanguages : null

      }

      this.setState(newState);

      $('#preloader').hide();

      // Refresh selects
      $('select.material').material_select();

    }.bind(this);
    GET(url, success)

  },
  render: function() {
    return (

      <div>

        <BasicsTab
          props={this.state}
          updateHome={this.updateHome}
        />

        <ImmersionsTab
          props={this.state}
          updateHome={this.updateHome}
        />

        <LocationTab
          props={this.state}
          updateHome={this.updateHome}
        />

        <DescriptionTab
          props={this.state}
          updateHome={this.updateHome}
        />

        <RoomsTab
          props={this.state}
          updateHome={this.updateHome}
          refreshState={this.refreshState}
        />

        <PhotosTab
          props={this.state}
          updateHome={this.updateHome}
          refreshState={this.refreshState}
        />

        <PricingTab
          props={this.state}
          updateHome={this.updateHome}
        />

      </div>

    );
  }
});
