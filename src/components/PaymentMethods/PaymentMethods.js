// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Accordion, Col, Row, Panel } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
import { getBraintreeClientToken } from 'redux/modules/payments/client-token'
import { deletePaymentMethod } from 'redux/modules/payments/payments'
import sendPaymentNonce from 'redux/modules/payments/nonce'
import $ from 'jquery'

// Relative imports
import CreditCard from './subcomponents/CreditCard'
import PayPal from './subcomponents/PayPal'
import styles from './PaymentMethods.styles.js'


@connect(state => ({
  payments: state.payments,
}))
@translate()
export default class PaymentMethods extends Component {

  state = {
    clientToken: null,
  }

  componentDidMount = () => {

    const { clientToken } = this.props.payments

    if (!clientToken.loaded && !clientToken.loading) {
      const { dispatch, token } = this.props
      dispatch(getBraintreeClientToken(token))
    }

  }

  componentDidUpdate = () => {

    const { t, token, dispatch } = this.props
    const { clientToken } = this.props.payments

    if (clientToken.loaded) {

      require.ensure(['braintree-web'], function() { // eslint-disable-line

        const braintree = require('braintree-web') // eslint-disable-line

        const braintreeSetupObject = { // eslint-disable-line
          id: 'add-payment-form',
          hostedFields: {
            number: {
              selector: '#card-number',
              placeholder: t('common.card_number_placeholder'),
            },
            cvv: {
              selector: '#cvv',
              placeholder: t('common.cvv_placeholder'),
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: t('common.expiration_placeholder'),
            },
            styles: {
              input: {
                'font-size': '1rem',
                color: '#3A3A3A',
                'font-family': 'Open Sans, sans serif',
              },
            },
          },
          paypal: {
            container: 'paypal-container',
            singleUse: false,
          },
          dataCollector: {
            paypal: true,
          },
          onPaymentMethodReceived: (obj) => {
            dispatch(sendPaymentNonce(token, obj.nonce, () => {
              dispatch(loadUserWithAuth(token))
              window.braintreeIntegration.teardown()
              braintree.setup(clientToken.value, 'custom', braintreeSetupObject)
              $('#add-new-paypal').addClass('hide')
            }))
          },
          onError(error) {
            console.log(error)
          },
          onReady(integration) {

            window.braintreeIntegration = integration

            /* eslint-disable */
            var doPaypalThingOnce = true

            $("#paypal-container").bind("DOMSubtreeModified", function() {

              if (doPaypalThingOnce) {
                $('#add-new-paypal').removeClass('hide')
                $('#bt-pp-cancel').click(function() {
                  $('#add-new-paypal').addClass('hide')
                })
              }
              doPaypalThingOnce = false

            })
            /* eslint-disable */

          },
        }

        // Setup braintree form
        braintree.setup(clientToken.value, 'custom', braintreeSetupObject)

      })

    }

  }

  deletePaymentMethod = paymentMethodID => {
    const { dispatch, token } = this.props
    dispatch(deletePaymentMethod(token, paymentMethodID))
  }

  render() {

    const { user, t } = this.props

    return (
      <Row>
        {user.paymentMethods.map(paymentMethod => {
          return paymentMethod.type === 'PAYPAL' ? <PayPal key={paymentMethod.id} {...paymentMethod} deletePaymentMethod={this.deletePaymentMethod} /> : <CreditCard key={paymentMethod.id} {...paymentMethod} deletePaymentMethod={this.deletePaymentMethod} />
        })}
        <Col xs={12} md={6}>
          <Panel>
            <h4>{t('common.Add_payment_method')}</h4>
            <form id='add-payment-form'>
              <Accordion>
                <Panel header={t('common.Credit_card')} eventKey='credit-card'>
                  <div id='card-number' className='form-control' style={styles.ccFullWidth} />
                  <div id='cvv' className='form-control' style={styles.ccHalfWidth} />
                  <div id='expiration-date' className='form-control' style={Object.assign({}, styles.ccHalfWidth, { marginLeft: 5 })} />
                  <input id='add-new-card' className='btn btn-flat btn-primary' type='submit' value={t('common.add_card_button')} onClick={this.showPreloader} />
                </Panel>
                <Panel header={t('common.PayPal')} eventKey='paypal'>
                  <div id='paypal-container' style={styles.paypalContainer} />
                  <input id='add-new-paypal' className='btn btn-flat btn-primary hide' type='submit' value={t('common.add_paypal_button')} onClick={this.showPreloader} />
                </Panel>
              </Accordion>
            </form>
          </Panel>
        </Col>
      </Row>
    )
  }
}

PaymentMethods.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  token: PropTypes.string,
  payments: PropTypes.object,
  t: PropTypes.func,
}
