var React = require('react');

var domains = require('domains');
var JWT = require('JWT');
var POST = require('POST');

var defaultBankCurrencies = require('default-bank-currencies');
var defaultPaypalCurrencies = require('default-paypal-currencies');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['countries']);

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
      } else {
        // Render IBAN bank UI
        this.setState({bank:'BANK'})
        $('.iban-ui').show();
        $('.iban-ui input').attr('required', 'required');
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
  render: function() {

    var bankCountries = [];
    for (var i=0; i<defaultBankCurrencies.length; i++) {
      bankCountries.push(<option value={defaultBankCurrencies[i]}>{defaultBankCurrencies[i]}</option>)
    }

    var paypalCountries = [];
    for (var i=0; i<defaultBankCurrencies.length; i++) {
      bankCountries.push(<option value={defaultBankCurrencies[i]}>{defaultBankCurrencies[i]}</option>)
    }

    return (

      <div className='row'>

        <div className='col s12 m6 l6'>
          <div className='add-payout'>
            <div className='header'>
              <div className='title'>Add bank account</div>
              <div className='subtitle'>Get paid directly into your bank account</div>
            </div>

            <form id='add-bank-payout' style='display:none'>

              <div className='row'>
                <div className='col s12 m6 l6 input-field'>
                  <input id='bank-first-name' type="text" className="validate" required />
                  <label className='inert'>First name</label>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <input id='bank-last-name' type="text" className="validate" required />
                  <label className='inert'>Last name</label>
                </div>
                <div className='col s12 input-field'>
                  <input id='bank-address-one' type="text" className="validate" required />
                  <label className='inert'>Billing address</label>
                </div>
                <div className='col s12 input-field'>
                  <input id='bank-address-two' type="text" className="validate" />
                  <label className='inert'>Billing address 2 / Zone</label>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <input id='bank-city' type="text" className="validate" required />
                  <label className='inert'>City</label>
                </div>
                <div className='col s12 m6 l6 input-field' required>
                  <input id='bank-state' type="text" className="validate" />
                  <label className='inert'>State / Province</label>
                </div>
                <div className='col s12 m6 l6 input-field' required>
                  <input id='bank-postcode' type="text" className="validate" />
                  <label className='inert'>Postal code</label>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <select id='bank-country' className='billing-country'>
                    <option disabled selected></option>
                    {bankCountries}
                  </select>
                </div>
                <div className='iban-ui'>
                  <div className='col s12 input-field'>
                    <input id="iban" type="text" className="validate" required />
                    <label for="iban">IBAN</label>
                  </div>
                  <div className='col s12 input-field'>
                    <input id="iban-again" type="text" className="validate" required />
                    <label for="iban-abain">Enter IBAN again</label>
                  </div>
                  <div className='col s12 input-field'>
                    <input id="swift-bic" type="text" className="validate" required />
                    <label for="swift-bic">SWIFT/BIC code</label>
                  </div>
                </div>
                <div className='routing-ui' style='display:none'>
                  <div className='col s12 input-field'>
                    <input id="routing-account-number" type="text" className="validate" />
                    <label for="routing-account-number">Account number</label>
                  </div>
                  <div className='col s12 input-field'>
                    <input id="routing-account-number-again" type="text" className="validate" />
                    <label for="routing-account-number-again">Enter account number again</label>
                  </div>
                  <div className='col s12 input-field'>
                    <input id="routing-number" type="text" className="validate" />
                    <label for="routing-number">Routing number</label>
                  </div>
                </div>
                <div className='col s12 input-field left-align grey-text'>
                  Currency: <span id='bank-currency'></span>
                </div>
              </div>

              <div className='footer'>
                <button type='submit' className='btn btn-primary btn-flat'>Add bank account</button>
              </div>

            </form>
          </div>
        </div>

        <div className='col s12 m6 l6'>
          <div className='add-payout'>
            <div className='header'>
              <div className='title'>Add PayPal account</div>
              <div className='subtitle'>Get paid into your PayPal account</div>
            </div>

            <form id='add-paypal-payout' style='display:none'>

              <div className='row'>
                <div className='col s12 m6 l6 input-field'>
                  <input id='paypal-first-name' type="text" className="validate" required />
                  <label className='inert'>First name</label>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <input id='paypal-last-name' type="text" className="validate" required />
                  <label className='inert'>Last name</label>
                </div>
                <div className='col s12 input-field'>
                  <input id="paypal-email" type="email" className="validate" />
                  <label for="paypal-email">PayPal email address</label>
                </div>
                <div className='col s12 input-field'>
                  <input id="paypal-email-again" type="email" className="validate" />
                  <label className='inert'>Enter email again</label>
                </div>
                <div className='col s12 input-field'>
                  <input id='paypal-address-one' type="text" className="validate" />
                  <label className='inert'>Billing address</label>
                </div>
                <div className='col s12 input-field'>
                  <input id='paypal-address-two' type="text" className="validate" />
                  <label className='inert'>Billing address 2 / Zone</label>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <input id='paypal-city' type="text" className="validate" />
                  <label className='inert'>City</label>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <input id='paypal-state' type="text" className="validate" />
                  <label className='inert'>State / Province</label>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <input id='paypal-postcode' type="text" className="validate" />
                  <label className='inert'>Postal code</label>
                </div>
                <div className='col s12 m6 l6 input-field'>
                  <select id='paypal-country' className='billing-country'>
                    <option disabled selected></option>
                    {paypalCountries}
                  </select>
                </div>
                <div className='col s12 input-field left-align grey-text'>
                  Currency: <span id='paypal-currency'></span>
                </div>
              </div>

              <div className='footer'>
                <button type='submit' className='btn btn-primary btn-flat'>Add PayPal account</button>
              </div>

            </form>

          </div>
        </div>

      </div>

    );
  }
});
