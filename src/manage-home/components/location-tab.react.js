const React = require('react')

var GoogleMapsLoader = require('google-maps')
GoogleMapsLoader.KEY = 'AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ'
GoogleMapsLoader.LIBRARIES = ['places']

const randomiseCoordinate = require('randomise-coordinate')
const compileGoogleAddress = require('compile-google-address')

const i18n = require('i18n')
const toast = require('toast')

module.exports = React.createClass({
  componentDidMount: function() {

    window.mapLat
    window.mapLng
    window.mapZoom

    // Default map settings
    mapLat = 60
    mapLng = 180
    mapZoom = 2

    window.initAutocomplete = function(google) {

      this.setState({ mapDidInit: true })

      var map = new google.maps.Map(document.getElementById('home-map'), {
        center: {
          lat: mapLat,
          lng: mapLng
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

      var firstLocationTabClick = function() {
        google.maps.event.trigger(map, 'resize')
        map.setZoom(map.getZoom())
        map.setCenter(new google.maps.LatLng(mapLat, mapLng))
        $('#location').unbind('click', firstLocationTabClick)
      }

      $('#location').bind('click', firstLocationTabClick)

      var markers = []

      if (mapLat !== 60 && mapLng !== 180) {

        window.circle = new google.maps.Circle({
          map: map,
          draggable: true,
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

        circle.addListener('dragend', function() {
          $('#save-location').removeClass('disabled')
          window.newLocationObj = this.props.props.location
        }.bind(this))

      }

      // Create the search box and link it to the UI element.
      var input = document.getElementById('home-address');
      var searchBox = new google.maps.places.SearchBox(input);

      google.maps.event.addListenerOnce(map, 'idle', function() {
         google.maps.event.trigger(map, 'resize');
         map.setCenter(new google.maps.LatLng(mapLat, mapLng))
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

          window.newLocationObj = compileGoogleAddress(place)

          if (newLocationObj === null) {
            toast(i18n.t('manage_home:invalid_address'))
          } else {
            $('a#save-location').hasClass('disabled') ? $('a#save-location').removeClass('disabled') : null;
            typeof circle !== 'undefined' ? circle.setMap(null) : null;
            window.circle = new google.maps.Circle({
              map: map,
              draggable: true,
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
    }.bind(this)

    $('a#save-location').click(this.saveLocation);

  },
  saveLocation: function() {

    console.log('firing')

    // Modify home object, using new location object
    if (typeof newLocationObj !== 'undefined') {

      newLocationObj.lat = randomiseCoordinate(circle.center.lat())
      newLocationObj.lng = randomiseCoordinate(circle.center.lng())

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

    if (this.state.mapDidInit !== true) {

      GoogleMapsLoader.load(function(google) {

        initAutocomplete(google);

      })

    }

  },
  render: function() {

    return (

      <div></div>

    );
  }
});
