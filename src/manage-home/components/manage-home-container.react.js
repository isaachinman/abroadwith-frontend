const React =               require('react');
const BasicsTab =           require('./basics-tab.react');
const ImmersionsTab =       require('./immersions-tab.react');
const LocationTab =         require('./location-tab.react');
const DescriptionTab =      require('./description-tab.react');
const RoomsTab =            require('./rooms-tab.react');
const PhotosTab =           require('./photos-tab.react');
const PricingTab =          require('./pricing-tab.react');

const homeStatusCodes =     require('home-status-codes');

const refreshToken = require('refresh-token')

const toast = require('toast');
const isOnScreen = require('is-on-screen');

const domains = require('domains');
const JWT = require('JWT');
const GET = require('GET');
const POST = require('POST');

const i18n = require('i18n');

module.exports = React.createClass({
  getInitialState: function() {
    return { firstTime: true }
  }
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

    if (JWT.cbk === 0) {
      this.refreshState();
    } else {
      $('#preloader').hide()
      setTimeout(function() {
        $('#verifications-modal').find('a.modal-close').remove()
        $('#verifications-modal').openModal({
          dismissible: false
        })
      }, 1000)
    }

    $('a#delete-home').click(function() {

      $('#preloader').show();

      $.ajax({
        url: domains.API + '/users/' + JWT.rid + '/homes/' + JWT.hid,
        type: 'DELETE',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
        },
        success: function(result) {

          refreshToken(function() {
            window.location = '/'
          });

        },
        error: function(response) {

          if (response.status === 409) {

            $('#delete-home-modal').closeModal()
            $('#home-deletion-failure').openModal()
          }

          $('#preloader').hide();
        }
      });

    })

  },
  refreshState: function() {

    $('#preloader').show();

    $('input').off();

    var url = domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid;
    var success = function(response) {

      console.log(response)

      if (response.homeActivationResponse.code === 'ACTIVATED' && this.state.firstTime === false) {

        // Reset step classes
        $('.ui.steps .step').attr('class', 'step');

        // Home is active
        $('#success').addClass('active');
        $('#success').addClass('completed');
        $('#success').prevAll().addClass('completed');

        // Show success tab
        $('.tab').hide();
        $('#success-tab').show();

        // Save buttons should say next
        $('.save-btn').html(i18n.t('manage_home:save_button'));

        // If active step is not visible, scroll to it
        if ($('#success').isOnScreen() === false) {
          $('.ui.steps').animate({
            scrollLeft: $('#success').position().left
          })
        }

        // All steps are clickable
        $('.step').addClass('link');

        // Set up the success page
        $('#home-published-image').attr('src',domains.IMG+response.photos[0]+'?w=800');
        $('#home-published-view').attr('href','/homestay/'+JWT.hid);

      } else {

        // Home is not active
        $('.step').find('.icon').hide()
        $('.ui.steps').addClass('ordered')

        // Determine which step is active
        for (var step in homeStatusCodes) {
          for (var code in homeStatusCodes[step]) {
            if (homeStatusCodes[step][code] === response.homeActivationResponse.code) {
              var activeStep = step;
            }
          }
        }

        // Save buttons should say next
        $('.save-btn').html(i18n.t('manage_home:next_button'))

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
        firstTime:                       false
      }

      this.setState(newState);

      $('#preloader').hide();

      // Refresh selects
      $('select.material').material_select();



    }.bind(this);
    GET(url, success)

  },
  componentDidUpdate: function() {
    $('.button-group-wrapper--manage-home').show()
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
