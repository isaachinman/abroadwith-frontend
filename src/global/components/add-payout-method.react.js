var React = require('react');

var domains = require('domains');
var JWT = require('JWT');
var POST = require('POST');

var defaultBankCurrencies = require('default-bank-currencies');
var defaultPaypalCurrencies = require('default-paypal-currencies');

var i18n = require('../../global/util/i18n');

module.exports = React.createClass({
  addBankPayout: function() {

    var updateAdmin = this.props.updateAdmin;

    if ($('#bank-country').val() === null || this.state.bank === 'undefined') {
      return;
    }

    if (this.state.bank === 'BANK' && $('#iban').val() !== $('#iban-again').val()) {
      return;
    }

    if (this.state.bank === 'ROUTING_TRANSIT' && $('#routing-account-number').val() !== $('#routing-account-number-again').val()) {
      return;
    }

    var newBankPayoutObj = {
      type: this.state.bank,
      firstName: $('#bank-first-name').val(),
      lastName: $('#bank-last-name').val(),
      address: {
        street: $('#bank-address-one').val(),
        complement: $('#bank-address-two').val(),
        city: $('#bank-city').val(),
        state: $('#bank-state').val(),
        zipCode: $('#bank-postcode').val(),
        country: $('#bank-country').val(),
      }
    }

    if (this.state.bank === 'BANK') {
      newBankPayoutObj.ibanCode = $('#iban').val();
      newBankPayoutObj.swiftBicCode = $('#swift-bic').val();
    } else if (this.state.bank === 'ROUTING_TRANSIT') {
      newBankPayoutObj.routingAccountNumber = $('#routing-account-number').val();
      newBankPayoutObj.routerNumber = $('#routing-number').val();
    }

    $('#preloader').show();

    console.log(newBankPayoutObj)

    var url = domains.API + '/users/' + JWT.rid + '/payoutMethods';
    var success = function(response) {
      $('#preloader').hide();
      updateAdmin();
      $('.add-payout .header').next().slideUp();
    }
    POST(url, newBankPayoutObj, success);


  },
  addPaypalPayout: function() {

    var updateAdmin = this.props.updateAdmin;

    if ($('#paypal-country').val() === null) {
      return;
    }

    if ($('#paypal-email').val() !== $('#paypal-email-again').val()) {
      return;
    }

    var newPaypalPayoutObj = {
      type: 'PAYPAL',
      firstName: $('#paypal-first-name').val(),
      lastName: $('#paypal-last-name').val(),
      email: $('#paypal-email').val(),
      address: {
        street: $('#paypal-address-one').val(),
        complement: $('#paypal-address-two').val(),
        city: $('#paypal-city').val(),
        state: $('#paypal-state').val(),
        zipCode: $('#paypal-postcode').val(),
        country: $('#paypal-country').val(),
      }
    }

    $('#preloader').show();

    console.log(newPaypalPayoutObj)

    var url = domains.API + '/users/' + JWT.rid + '/payoutMethods';
    var success = function(response) {
      $('#preloader').hide();
      updateAdmin();
      $('.add-payout .header').next().slideUp();
    }
    POST(url, newPaypalPayoutObj, success);

  },
  componentDidMount: function() {

    $('form#add-bank-payout').submit(function(e) {
      this.addBankPayout();
      return false;
    }.bind(this))

    $('form#add-paypal-payout').submit(function(e) {
      this.addPaypalPayout();
      return false
    }.bind(this))

    // Initialise billing country selects
    $("select.billing-country").each(function() {
      $(this).select2({
        placeholder: "Country"
      });
    })

    // Change function for bank country select
    $('select#bank-country').change(function() {
      var country = $('select#bank-country').val()
      $('#bank-currency').html(defaultBankCurrencies[country])
      if (country === 'CA' || country === 'GU' || country === 'MH' || country === 'PR' || country === 'US') {
        // Render Routing bank UI
        this.setState({bank:'ROUTING_TRANSIT'})
        $('.iban-ui').hide();
        $('.iban-ui input').removeAttr('required', 'required');
        $('.routing-ui').show();
        $('.routing-ui input').attr('required', 'required');
        $('#bank-state').attr('required', 'required');
      } else {
        // Render IBAN bank UI
        this.setState({bank:'BANK'})
        $('.iban-ui').show();
        $('.iban-ui input').attr('required', 'required');
        $('#bank-state').removeAttr('required');
        $('.routing-ui').hide();
        $('.routing-ui input').removeAttr('required', 'required');
      }
    }.bind(this))

    // Change function for paypal country select
    $('select#paypal-country').change(function() {
      var country = $(this).val()
      $('#paypal-currency').html(defaultPaypalCurrencies[country] ? defaultPaypalCurrencies[country] : 'EUR')
    })

  },
  componentWillUnmount: function() {
    $('select#bank-country').off();
    $('select#paypal-country').off();
    $('form#add-bank-payout').off();
    $('form#add-paypal-payout').off();
  },
  render: function() {

    return (

      <div></div>

    );
  }
});
