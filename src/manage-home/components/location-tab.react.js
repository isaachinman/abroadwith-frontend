var React = require('react');

var randomiseCoordinate = require('randomise-coordinate');

var i18n = require('../../global/util/i18n');
var toast = require('toast');

module.exports = React.createClass({
  componentDidMount: function() {

    window.mapLat;
    window.mapLng;
    window.mapZoom;

    // Default map settings
    mapLat = 60;
    mapLng = 180;
    mapZoom = 2;

    window.initAutocomplete = function() {
      var map = new google.maps.Map(document.getElementById('home-map'), {
        center: {
          lat: mapLat+.0025,
          lng: mapLng-.0125
        },
        zoom: mapZoom,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false
      });

      var markers = [];

      if (mapLat !== 60 && mapLng !== 180) {

        window.circle = new google.maps.Circle({
          map: map,
          radius: 150,    // 10 miles in metres
          strokeColor: '#4A91E2',
          strokeOpacity: 0.8,
          fillColor: '#4A91E2',
          fillOpacity: 0.35,
          center: {
            lat: mapLat,
            lng: mapLng
          }
        });

      }

      // Create the search box and link it to the UI element.
      var input = document.getElementById('home-address');
      var searchBox = new google.maps.places.SearchBox(input);

      google.maps.event.addListenerOnce(map, 'idle', function() {
         google.maps.event.trigger(map, 'resize');
      });

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {

        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {

          var googleResponse = place.address_components;
          var googleResponseParsed={};

          $.each(googleResponse, function(k,v1) {jQuery.each(v1.types, function(k2, v2){googleResponseParsed[v2]=v1.short_name});})

          window.newLocationObj = {
            "street":googleResponseParsed.street_number+' '+googleResponseParsed.route,
            "zipCode":googleResponseParsed.postal_code,
            "city":googleResponseParsed.locality,
            "country":googleResponseParsed.country,
            "neighbourhood":googleResponseParsed.sublocality_level_2,
            "lat":randomiseCoordinate(place.geometry.location.lat()),
            "lng":randomiseCoordinate(place.geometry.location.lng())
          }

          if (newLocationObj.street == undefined || newLocationObj.city == undefined || newLocationObj.country == undefined || newLocationObj.lat == undefined || newLocationObj.lng == undefined) {
            alert('Invalid address')
          } else {
            $('a#save-location').hasClass('disabled') ? $('a#save-location').removeClass('disabled') : null;
            typeof circle !== 'undefined' ? circle.setMap(null) : null;
            window.circle = new google.maps.Circle({
              map: map,
              radius: 150,
              strokeColor: '#4A91E2',
              strokeOpacity: 0.8,
              fillColor: '#4A91E2',
              fillOpacity: 0.35,
              center: place.geometry.location
            });

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }


            map.fitBounds(bounds);
            map.setZoom(16);
          }

        });

      });
    }
    $('#location-tab-trigger').click(initHiddenMap)
    function initHiddenMap(e) {
      document.getElementById('location-tab').removeEventListener('click', initHiddenMap)
      initAutocomplete();
    }

    $('a#save-location').click(this.saveLocation);

    $.getScript( "https://maps.googleapis.com/maps/api/js?key=AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ&libraries=places&callback=initAutocomplete", function() {});
  },
  saveLocation: function() {

    // Modify home object, using new location object
    if (typeof newLocationObj !== 'undefined') {

      var newHomeObj = this.props.props;
      newHomeObj.location = newLocationObj;

      this.props.updateHome(newHomeObj, function() {
        toast(i18n.t('manage_home:address_updated_toast'));
      });

    }

  },
  componentDidUpdate: function() {

    if (this.props.props.location) {

      var fullAddress = this.props.props.location.street + ', ' + (this.props.props.location.complement !== null ? this.props.props.location.complement + ', ' : '') + this.props.props.location.city + ' ' + this.props.props.location.zipCode + ', ' + this.props.props.location.country;
      mapLat = this.props.props.location.lat;
      mapLng = this.props.props.location.lng;
      mapZoom = 16;

      $('#home-address').val(fullAddress);

    } else {
      mapLat = 60;
      mapLng = 180;
      mapZoom = 2;
    }

  },
  render: function() {

    return (

      <div></div>

    );
  }
});
