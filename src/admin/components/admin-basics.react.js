var React = require('react');
var toast = require('toast');

module.exports = React.createClass({
  saveBasics: function() {

    adminObj.firstName = $('#firstName').val();
    adminObj.lastName = $('#lastName').val();
    adminObj.gender = $('#gender').val();
    adminObj.birthDate = $('#birthDate').val();
    adminObj.location = $('#location').val();
    $('#phoneNumber').intlTelInput('isValidNumber') ? adminObj.phoneNumber = $('#phoneNumber').val() : null;
    adminObj.email = $('#user-email').val();
    adminObj.emergencyContact ? null : adminObj.emergencyContact = {};
    adminObj.emergencyContact.name = $('#emergency-name').val();
    adminObj.emergencyContact.phone = $('#emergency-phone').val();
    adminObj.emergencyContact.email = $('#emergency-email').val();
    adminObj.emergencyContact.relationship = $('#emergency-relationship').val();

    this.props.updateAdmin(function() {
      toast('Basics updated');
    });

  },
  componentDidMount: function() {

    $('form#basics-form').submit(this.saveBasics);

    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/intlTelInput.min.js', function() {
      $('#phoneNumber').intlTelInput();
      $('#phoneNumber').change(function() {
        $('#phoneNumber').intlTelInput();
      })
      $('#phoneNumber').trigger('change');
      $.getScript('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js');
    })


    var placeSearch,
      autocomplete;
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'short_name',
      administrative_area_level_1: 'short_name',
      country: 'short_name',
      postal_code: 'short_name'
    };

    var newAddress = {};

    window.initAutocomplete = function() {
      // Create the autocomplete object, restricting the search to geographical
      // location types.
      autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */
      (document.getElementById('user-address')), {types: ['geocode']});

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete.addListener('place_changed', fillInAddress);
    }

    function fillInAddress() {

      // Get the place details from the autocomplete object.
      var place = autocomplete.getPlace();

      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          newAddress[addressType] = val;
        }
      }

      adminObj.address === null ? adminObj.address = {} : null;
      newAddress.locality ? adminObj.address.city = newAddress.locality : null;
      newAddress.country ? adminObj.address.country = newAddress.country : null;

    }

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({center: geolocation, radius: position.coords.accuracy});
          autocomplete.setBounds(circle.getBounds());
        });
      }
    }

    $.getScript("https://maps.googleapis.com/maps/api/js?libraries=places&callback=initAutocomplete", function() {});

  },
  componentDidUpdate: function() {
    // Basics tab
    $('#firstName').val(this.props.firstName);
    $('#lastName').val(this.props.lastName);
    $('#gender').val(this.props.gender);
    $('#birthDate').val(this.props.birthDate);
    $('#location').val(this.props.location);
    $('#phoneNumber').val(this.props.phoneNumber);
    $('#user-email').val(this.props.email);
    $('#emergency-name').val(this.props.emergencyName);
    $('#emergency-phone').val(this.props.emergencyPhone);
    $('#emergency-email').val(this.props.emergencyEmail);
    $('#emergency-relationship').val(this.props.emergencyRelationship);

    $('select#gender').material_select();
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
