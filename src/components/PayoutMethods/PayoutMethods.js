// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Accordion, Button, Col, FormControl, FormGroup, Row, Panel } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import defaultBankCurrencies from 'data/constants/DefaultBankCurrencies'

// Relative imports
import styles from './PayoutMethods.styles'

@connect(state => ({
  jwt: state.auth.token,
  user: state.privateData.user.data,
}))
@translate()
export default class PayoutMethods extends Component {

  state = {
    bankType: 'IBAN',
    currency: 'EUR',
  }

  handleCountryChange = event => {
    console.log(event.target.value)

    const country = event.target.value

    // Check if country uses routing or iban
    const usesRouting = ['CA', 'GU', 'MH', 'PR', 'US'].includes(country)

    // Update
    this.setState({
      bankType: usesRouting ? 'ROUTING' : 'IBAN',
      currency: defaultBankCurrencies[country],
    })


  }

  render() {

    const {
      t,
    } = this.props

    const {
      bankType,
      currency,
    } = this.state

    const bankCountries = Object.keys(defaultBankCurrencies).map(country => {
      return (
        <option key={country} value={country}>{t(`countries.${country}`)}</option>
        )
    })

    bankCountries.sort((a, b) => {
      if (a.props.children < b.props.children) return -1
      if (a.props.children > b.props.children) return 1
      return 0
    })

    return (
      <Row>
        <Col xs={12}>
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
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={6}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('common.Last_name')}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_billing_address')}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_billing_address2')}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={6}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_city')}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={6}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_state')}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={6}>
                    <FormGroup>
                      <FormControl
                        type='text'
                        placeholder={t('admin.payments_zipcode')}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={6}>
                    <FormGroup>
                      <FormControl
                        componentClass='select'
                        onChange={event => this.handleCountryChange(event)}
                        placeholder={t('admin.payments_country')}
                        defaultValue=''
                      >
                        <option value='' disabled>{t('admin.payments_country')}</option>
                        {bankCountries}
                      </FormControl>
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                </Row>

                {bankType === 'IBAN' &&
                  <span>
                    <Row>
                      <Col xs={12}>
                        <FormGroup>
                          <FormControl
                            type='text'
                            placeholder={t('admin.payments_bank_iban')}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <FormGroup>
                          <FormControl
                            type='text'
                            placeholder={t('admin.payments_bank_iban2')}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <FormGroup>
                          <FormControl
                            type='text'
                            placeholder={t('admin.payments_bank_swift')}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>
                  </span>
                }

                {bankType === 'ROUTING' &&
                  <span>
                    <Row>
                      <Col xs={12}>
                        <FormGroup>
                          <FormControl
                            type='text'
                            placeholder={t('admin.payments_bank_account')}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <FormGroup>
                          <FormControl
                            type='text'
                            placeholder={t('admin.payments_bank_account2')}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <FormGroup>
                          <FormControl
                            type='text'
                            placeholder={t('admin.payments_bank_routing')}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>
                  </span>
                }

                <div>
                  <strong>{t('admin.payments_currency')}:</strong> {currency}
                </div>

                <Button style={styles.addPayoutButton} bsStyle='success'>{t('admin.payments_add_bank_account')}</Button>

              </Panel>

              <Panel header={t('admin.payments_add_paypal_account')} eventKey='paypal'>
                <div id='paypal-container' style={styles.paypalContainer} />
                <input id='add-new-paypal' className='btn btn-flat btn-primary hide' type='submit' value={t('common.add_paypal_button')} onClick={this.showPreloader} />
              </Panel>
            </Accordion>

          </Panel>
        </Col>
      </Row>
    )
  }
}

PayoutMethods.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
}
