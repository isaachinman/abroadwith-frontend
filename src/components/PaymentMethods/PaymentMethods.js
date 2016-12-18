// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { getBraintreeClientToken } from 'redux/modules/payments/client-token'

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

    const { t } = this.props
    const { clientToken } = this.props.payments

    if (clientToken.loaded) {


        // Setup braintree form
        braintree.setup(clientToken.value, 'custom', { // eslint-disable-line
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
          onPaymentMethodReceived(obj) {
            console.log(obj)
          // sendPaymentNonce(obj.nonce, function () {
          //   callback()
          //   $('#add-payment-method').remove()
          // })
          },
          onError(error) {
            console.log(error)
          },
          onReady(integration) {

            console.log(integration)

          },
        })


    }

  }

  render() {

    console.log(this)

    const { t } = this.props

    return (
      <Row>
        <Col xs={12} md={6} lg={3}>
          Braintree init here
          <form id='add-payment-form' className='center-align relative'>

            <div id='braintree-preloader' className='preloader-container preloader-container--absolute'>
              <div className='preloader-wrapper big active'>
                <div className='spinner-layer spinner-blue-only'>
                  <div className='circle-clipper left'>
                    <div className='circle' />
                  </div>
                  <div className='gap-patch'>
                    <div className='circle' />
                  </div>
                  <div className='circle-clipper right'>
                    <div className='circle' />
                  </div>
                </div>
              </div>
            </div>

            <div className='title'>{t('common.Add_payment_method')}</div>
            <ul className='collapsible' data-collapsible='accordion'>
              <li>
                <div className='collapsible-header'>{t('common.Credit_card')}</div>
                <div className='collapsible-body'>
                  <div className='row'>

                    <div className='col s12'>

                      <div className='input-field'>
                        <div id='card-number' className='braintree-input' />
                      </div>
                    </div>

                    <div className='col s6'>
                      <div className='input-field'>
                        <div id='cvv' className='braintree-input' />
                      </div>
                    </div>

                    <div className='col s6'>
                      <div className='input-field'>
                        <div id='expiration-date' className='braintree-input' />
                      </div>
                    </div>

                  </div>

                  <div className='row'>
                    <div className='col s12'>
                      <input id='add-new-card' className='btn btn-flat btn-primary' type='submit' value={t('common.add_card_button')} onClick={this.showPreloader} />
                    </div>
                  </div>

                </div>
              </li>
              <li>
                <div className='collapsible-header'>{t('common.PayPal')}</div>
                <div className='collapsible-body'>

                  <div id='paypal-container' className='row no-margin-bottom section center-align' />

                  <div className='row'>
                    <div className='col s12'>
                      <input id='add-new-paypal' className='btn btn-flat btn-primary hide' type='submit' value={t('common.add_paypal_button')} onClick={this.showPreloader} />
                    </div>
                  </div>

                </div>
              </li>
            </ul>

          </form>

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
