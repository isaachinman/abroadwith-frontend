// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Accordion, Button, Col, Row, Panel } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
import { getBraintreeClientToken } from 'redux/modules/payments/clientToken'
import { deletePaymentMethod } from 'redux/modules/payments/payments'
import { sendPaymentNonce } from 'redux/modules/payments/nonce'
import { SpinLoader } from 'components'

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
    addNewMethodAccordionExpanded: 'none',
    clientToken: null,
    initialised: false,
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

    if (clientToken.loaded && !this.state.initialised) {

      this.setState({ initialised: true })

      const closeAccordion = () => this.setState({ addNewMethodAccordionExpanded: 'none' })

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
                'font-family': 'Karla, sans serif',
              },
              button: {
                'text-transform': 'uppercase',
              },
            },
          },
          paypal: {
            container: 'paypal-container',
            singleUse: false,
            onSuccess: nonce => {

              // This is paypal creation
              dispatch(sendPaymentNonce(token, nonce, () => {
                dispatch(loadUserWithAuth(token))
                closeAccordion()
              }))

            },
          },
          dataCollector: {
            paypal: true,
          },
          onPaymentMethodReceived: (obj) => {

            // This is credit card creation
            dispatch(sendPaymentNonce(token, obj.nonce, () => {
              dispatch(loadUserWithAuth(token))
              closeAccordion()
            }))

          },
          onReady(integration) {
            window.braintreeIntegration = integration
          },
        }

        // Setup braintree form
        braintree.setup(clientToken.value, 'custom', braintreeSetupObject)

      })

    }

  }

  componentWillUnmount = () => {
    if (typeof window.braintreeIntegration !== 'undefined') {
      window.braintreeIntegration.teardown()
    }
  }

  panelToggle = panel => this.setState({ addNewMethodAccordionExpanded: this.state.addNewMethodAccordionExpanded === panel ? 'none' : panel })

  deletePaymentMethod = paymentMethodID => {
    const { dispatch, token } = this.props
    dispatch(deletePaymentMethod(token, paymentMethodID))
  }

  render() {

    const { insideBooking, user, payments, t } = this.props

    return (
      <SpinLoader show={payments.nonce.loading}>
        <Row>
          {user.paymentMethods.map(paymentMethod => {
            if (!insideBooking || (insideBooking && user.paymentMethods.indexOf(paymentMethod) === 0)) {
              if (paymentMethod.type === 'PAYPAL') {
                return (
                  <PayPal
                    deletePaymentMethod={this.deletePaymentMethod}
                    insideBooking={insideBooking}
                    key={paymentMethod.id}
                    {...paymentMethod}
                  />
                )
              } else if (paymentMethod.type === 'CARD') {
                return (
                  <CreditCard
                    deletePaymentMethod={this.deletePaymentMethod}
                    insideBooking={insideBooking}
                    key={paymentMethod.id}
                    {...paymentMethod}
                  />
                )
              }
            }
          })}
          <div className={(!insideBooking || (insideBooking && user.paymentMethods.length === 0)) ? '' : 'hide'}>
            <Col xs={12} md={insideBooking ? 8 : 6} lg={6} style={insideBooking ? { marginRight: '33%' } : {}}>
              <Panel style={insideBooking ? { boxShadow: 'none' } : {}}>
                <h4 className='header-green'>{t('common.Add_payment_method')}</h4>
                <form id='add-payment-form' onSubmit={e => e.preventDefault()}>
                  <Accordion activeKey={this.state.addNewMethodAccordionExpanded} onSelect={this.panelToggle}>
                    <Panel header={t('common.Credit_card')} eventKey='credit-card'>
                      <div id='card-number' className='form-control' style={styles.ccFullWidth} />
                      <div id='cvv' className='form-control' style={styles.ccHalfWidth} />
                      <div id='expiration-date' className='form-control' style={Object.assign({}, styles.ccHalfWidth, { marginLeft: 5 })} />
                      <Button id='add-new-card' bsStyle='success' type='submit'>{t('common.add_card_button')}</Button>
                    </Panel>
                    <Panel header={t('common.PayPal')} eventKey='paypal'>
                      <div id='paypal-container' style={styles.paypalContainer} />
                      <Button id='add-new-paypal' className='btn btn-flat btn-primary hide' type='submit' value={t('common.add_paypal_button')} />
                    </Panel>
                  </Accordion>
                </form>
              </Panel>
            </Col>
          </div>
        </Row>
      </SpinLoader>
    )
  }
}

PaymentMethods.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  insideBooking: PropTypes.bool,
  jwt: PropTypes.object,
  token: PropTypes.string,
  payments: PropTypes.object,
  t: PropTypes.func,
}
