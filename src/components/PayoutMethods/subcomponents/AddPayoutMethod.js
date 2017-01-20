// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Accordion, Button, Col, FormControl, FormGroup, Row, Panel } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { addPayoutMethod } from 'redux/modules/payments/payments'
import defaultBankCurrencies from 'data/constants/DefaultBankCurrencies'
import debounce from 'debounce'

// Relative imports
import styles from '../PayoutMethods.styles.js'

@translate()
export default class AddPayoutMethod extends Component {

  state = {
    bankType: 'BANK',
    bankCurrency: 'EUR',
    paypalCurrency: 'EUR',
    newBankObject: {
      type: null,
      firstName: null,
      lastName: null,
      ibanCode: null,
      swiftBicCode: null,
      routerNumber: null,
      routingAccountNumber: null,
      address: {
        street: null,
        complement: null,
        city: null,
        country: null,
        neighbourhood: null,
        zipCode: null,
        state: null,
        lat: null,
        lng: null,
      },
    },
    newPayPalObject: {
      type: null,
      firstName: null,
      lastName: null,
      ibanCode: null,
      swiftBicCode: null,
      routerNumber: null,
      routingAccountNumber: null,
      address: {
        street: null,
        complement: null,
        city: null,
        country: null,
        neighbourhood: null,
        zipCode: null,
        state: null,
        lat: null,
        lng: null,
      },
    },
  }

  handleBankCountryChange = event => {

    const country = event.target.value

    // Check if country uses routing or iban
    const usesRouting = ['CA', 'GU', 'MH', 'PR', 'US'].includes(country)

    // Update
    const newState = Object.assign({}, this.state, {
      bankType: usesRouting ? 'ROUTING_TRANSIT' : 'BANK',
      bankCurrency: defaultBankCurrencies[country],
    })
    newState.newBankObject.address.country = country
    this.setState(newState)

  }

  handlePayPalCountryChange = event => {

    const country = event.target.value

    // Update
    const newState = Object.assign({}, this.state, {
      paypalCurrency: defaultBankCurrencies[country],
    })
    newState.newPayPalObject.address.country = country
    this.setState(newState)

  }

  handleBankInputChange = (value, fieldName, isAddressField) => {

    const payoutObject = this.state.newBankObject

    if (isAddressField) {
      payoutObject.address[`${fieldName}`] = value
    } else {
      payoutObject[`${fieldName}`] = value
    }

    this.setState({ newBankObject: payoutObject })
  }

  handlePayPalInputChange = (value, fieldName, isAddressField) => {

    const payoutObject = this.state.newPayPalObject

    if (isAddressField) {
      payoutObject.address[`${fieldName}`] = value
    } else {
      payoutObject[`${fieldName}`] = value
    }

    this.setState({ newPayPalObject: payoutObject })
  }

  addPayoutMethod = type => {

    const { dispatch, jwt } = this.props
    const payoutObject = this.state[`new${type}Object`]

    if (type === 'Bank') {
      payoutObject.type = this.state.bankType
    } else if (type === 'PayPal') {
      payoutObject.type = 'PAYPAL'
    }
    dispatch(addPayoutMethod(jwt, payoutObject))

  }

  render() {

    const {
      t,
    } = this.props

    const {
      bankType,
      bankCurrency,
      paypalCurrency,
      newBankObject,
      newPayPalObject,
    } = this.state

    const bankCountries = Object.keys(defaultBankCurrencies).map(country => {
      return (
        <option key={country} value={country}>{t(`countries.${country}`)}</option>
      )
    })

    // Sort bank countries alphabetically
    bankCountries.sort((a, b) => {
      if (a.props.children < b.props.children) return -1
      if (a.props.children > b.props.children) return 1
      return 0
    })

    // Validate bank object
    let requiredFields = [ newBankObject.firstName, newBankObject.lastName, newBankObject.address.street, newBankObject.address.city, newBankObject.address.state, newBankObject.address.zipCode, newBankObject.address.country ] // eslint-disable-line
    if (bankType === 'BANK') {
      requiredFields = requiredFields.concat([newBankObject.ibanCode, newBankObject.swiftBicCode])
    } else if (bankType === 'ROUTING_TRANSIT') {
      requiredFields = requiredFields.concat([newBankObject.routingAccountNumber, newBankObject.routerNumber])
    }
    const bankFormIsValid = !(requiredFields.some(field => !field))

    // Validate PayPal object
    const paypalFormIsValid = ![newPayPalObject.firstName, newPayPalObject.lastName, newPayPalObject.address.street, newPayPalObject.address.city, newPayPalObject.address.state, newPayPalObject.address.zipCode, newPayPalObject.address.country, newPayPalObject.email ].some(field => !field) // eslint-disable-line

    // Debounce update functions
    const handleBankInputChange = debounce(this.handleBankInputChange, 100)
    const handlePayPalInputChange = debounce(this.handlePayPalInputChange, 100)

    return (
      <Col xs={12} sm={10} md={8}>
        <Panel>
          <h4>{t('common.Add_payment_method')}</h4>

          <Accordion>

            <Panel header={t('admin.payments_add_bank_account')} eventKey='bank'>
              <Row>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('common.First_name')}
                      onChange={event => handleBankInputChange(event.target.value, 'firstName', false)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('common.Last_name')}
                      onChange={event => handleBankInputChange(event.target.value, 'lastName', false)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_billing_address')}
                      onChange={event => handleBankInputChange(event.target.value, 'street', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_billing_address2')}
                      onChange={event => handleBankInputChange(event.target.value, 'complement', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_city')}
                      onChange={event => handleBankInputChange(event.target.value, 'city', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_state')}
                      onChange={event => handleBankInputChange(event.target.value, 'state', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_zipcode')}
                      onChange={event => handleBankInputChange(event.target.value, 'zipCode', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      componentClass='select'
                      onChange={event => this.handleBankCountryChange(event)}
                      placeholder={t('admin.payments_country')}
                      defaultValue=''
                    >
                      <option value='' disabled>{t('admin.payments_country')}</option>
                      {bankCountries}
                    </FormControl>
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>

                {bankType === 'BANK' &&
                <span>
                  <Col xs={12}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_bank_iban')}
                        onChange={event => handleBankInputChange(event.target.value, 'ibanCode', false)}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_bank_swift')}
                        onChange={event => handleBankInputChange(event.target.value, 'swiftBicCode', false)}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                </span>
              }

                {bankType === 'ROUTING_TRANSIT' &&
                <span>
                  <Col xs={12}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_bank_account')}
                        onChange={event => handleBankInputChange(event.target.value, 'routingAccountNumber', false)}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_bank_routing')}
                        onChange={event => handleBankInputChange(event.target.value, 'routerNumber', false)}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>

                </span>
              }

                <Col xs={12}>
                  <strong>{t('admin.payments_currency')}:</strong> {bankCurrency}
                </Col>
              </Row>
              <Button
                style={styles.addPayoutButton}
                disabled={!bankFormIsValid}
                bsStyle='success'
                onClick={() => this.addPayoutMethod('Bank')}
              >
                {t('admin.payments_add_bank_account')}
              </Button>

            </Panel>

            <Panel header={t('admin.payments_add_paypal_account')} eventKey='paypal'>

              <Row>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('common.First_name')}
                      onChange={event => handlePayPalInputChange(event.target.value, 'firstName', false)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('common.Last_name')}
                      onChange={event => handlePayPalInputChange(event.target.value, 'lastName', false)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_billing_address')}
                      onChange={event => handlePayPalInputChange(event.target.value, 'street', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_billing_address2')}
                      onChange={event => handlePayPalInputChange(event.target.value, 'complement', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_city')}
                      onChange={event => handlePayPalInputChange(event.target.value, 'city', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_state')}
                      onChange={event => handlePayPalInputChange(event.target.value, 'state', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_zipcode')}
                      onChange={event => handlePayPalInputChange(event.target.value, 'zipCode', true)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <FormControl
                      componentClass='select'
                      onChange={event => this.handlePayPalCountryChange(event)}
                      placeholder={t('admin.payments_country')}
                      defaultValue=''
                    >
                      <option value='' disabled>{t('admin.payments_country')}</option>
                      {bankCountries}
                    </FormControl>
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      type='text'
                      placeholder={t('admin.payments_paypal_email')}
                      onChange={event => handlePayPalInputChange(event.target.value, 'email', false)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <strong>{t('admin.payments_currency')}:</strong> {paypalCurrency}
                </Col>
              </Row>

              <Button
                style={styles.addPayoutButton}
                disabled={!paypalFormIsValid}
                bsStyle='success'
                onClick={() => this.addPayoutMethod('PayPal')}
              >
                {t('admin.payments_add_paypal_account')}
              </Button>

            </Panel>
          </Accordion>

        </Panel>
      </Col>
    )
  }
}

AddPayoutMethod.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.string,
  t: PropTypes.func,
}
