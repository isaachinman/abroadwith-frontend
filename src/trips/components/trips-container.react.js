var React = require('react');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips']);

var jwt_decode = require('jwt-decode');
var domains = require('domains');

module.exports = React.createClass({
  updateHome: function(callback){

    $('#preloader').show();

    delete homeObj.GENERAL;
    var updateHome = this.updateHome;

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    console.log(homeObj)

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid,
      type: "POST",
      data: JSON.stringify(homeObj),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(homeStatus) {

        console.log(JSON.stringify(homeStatus))

        // Update status bar
        var publishedBar = $('#published-status');
        if (homeStatus.activated === false) {

          // If home is active, swap classes and text of publishedBar
          publishedBar.addClass('manage-home-info-text--unpublished');
          publishedBar.html(i18n.t('manage_home:message_bottom_unpublished') + ' (' + i18n.t('homes:published_codes.'+homeStatus.code) + ')');

        } else if (homeStatus.activated === true) {

          // If home is inactive, swap classes and text of publishedBar
          publishedBar.addClass('manage-home-info-text--published');
          publishedBar.html(i18n.t('homes:published_codes.'+homeStatus.code) + ' (' + '<a id="unpublish-home">Click here to unpublish</a>' + ')');

          // If home is inactive, create an unpublish function
          $('a#unpublish-home').click(function() {
            homeObj.immersions.stay.languagesOffered = [];
            homeObj.immersions.tandem.languagesOffered = [];
            homeObj.immersions.teacher.languagesOffered = [];
            updateHome(function() {
              return;
            });
          })

        }

        $('#preloader').hide();

        this.refreshState();

        callback();

      }.bind(this),
      error: function() {

        $('#preloader').hide();
        alert('Something failed');

      }
    })

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
        if (this.isMounted()) {
          this.setState(newState);
          console.log(this.state)
        }

        // Refresh selects
        $('select.material').material_select();

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
