// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Col, Grid, Panel, Row } from 'react-bootstrap'
import { loadInvoice } from 'redux/modules/privateData/invoices/invoices'
import Helmet from 'react-helmet'
import Currencies from 'data/constants/Currencies'

// Relative imports
import styles from './InvoiceHomestay.styles'

@connect(
  (state, ownProps) => ({
    invoice: state.privateData.invoices[ownProps.params.invoiceID],
    token: state.auth.token,
  })
)
@translate()
export default class InvoiceHomestay extends Component {

  componentDidMount = () => {
    const { dispatch, token, routeParams } = this.props
    dispatch(loadInvoice(token, routeParams.invoiceID))
  }

  render() {

    const { invoice, t } = this.props

    let currency

    if (invoice && invoice.data) {
      currency = Currencies[invoice.data.currency]
      console.log(currency)
      if (!invoice.data.baseFees && invoice.data.totalServiceFee < 0) {

        // This is a refund invoice
        // $('#base-fees-row').remove()
        // $('#vat-fees-row').remove()
        // $('#total-amount').html(i18n.t('receipts_invoices:amount_refunded'))
        // $('#bookingCode').html(response.bookingCode)
        // $('#serviceRenderedAt').html(response.serviceRenderedAt)
        // $('#billingAddress').html(response.billingAddress)
        // $('#fullName').html(response.fullName)
        // $('#vatCountry').html(i18n.t('countries:' + response.vatCountry))
        // $('#vatRate').html(response.vatRate)
        // $('#totalServiceFee').html(currency + Math.abs(response.totalServiceFee))

      } else {

        // This is a normal invoice
        // $('#bookingCode').html(response.bookingCode)
        // $('#serviceRenderedAt').html(response.serviceRenderedAt)
        // $('#billingAddress').html(response.billingAddress)
        // $('#fullName').html(response.fullName)
        // $('#vatCountry').html(i18n.t('countries:' + response.vatCountry))
        // $('#vatRate').html(response.vatRate)
        // $('#baseFees').html(currency + response.baseFees)
        // $('#vatAmount').html(currency + response.vatAmount)
        // $('#totalServiceFee').html(currency + response.totalServiceFee)

      }

    }

    console.log(this)

    return (
      <div>

        <Helmet title={t('receipts_invoices.invoice_title')} />

        {invoice && invoice.data &&
          <Grid>
            <Row style={styles.h1Row}>
              <Col xs={12}>
                <h1>{t('receipts_invoices.invoice_title')}</h1>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Panel style={styles.panel}>
                  <Row>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.confirmation_code')}:</strong> {invoice.data.bookingCode}
                    </Col>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.date_rendered')}:</strong> {invoice.data.serviceRenderedAt}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.full_name')}:</strong> {invoice.data.fullName}
                    </Col>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.billing_address')}:</strong> {invoice.data.billingAddress}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.vat_country')}:</strong> {invoice.data.vatCountry ? <span>{t(`countries.${invoice.data.vatCountry}`)}</span> : <span>{t('trips.not_applicable')}</span>}
                    </Col>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.vat_rate')}:</strong> {invoice.data.vatNumber ? <span>{invoice.data.vatNumber}</span> : <span>{t('trips.not_applicable')}</span>}
                    </Col>
                  </Row>
                  <Row style={styles.bottomBorder}>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.base_service_fee')}:</strong> {invoice.data.baseFees ? <span>{currency}{(invoice.data.baseFees).toFixed(2)}</span> : <span>{t('trips.not_applicable')}</span>}
                    </Col>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.vat')}:</strong> {invoice.data.vatAmount ? <span>{currency}{(invoice.data.vatAmount).toFixed(2)}</span> : <span>{t('trips.not_applicable')}</span>}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <strong>{t('receipts_invoices.total_service_fee')}:</strong> {invoice.data.totalServiceFee ? <span>{currency}{(invoice.data.totalServiceFee).toFixed(2)}</span> : <span>{t('trips.not_applicable')}</span>}
                    </Col>
                  </Row>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div>{t('receipts_invoices.invoice_address_line_1')}</div>
                <div>{t('receipts_invoices.invoice_address_line_2')}</div>
                <div>{t('receipts_invoices.invoice_address_line_3')}</div>
                <div>{t('receipts_invoices.invoice_address_line_4')}</div>
              </Col>
            </Row>
          </Grid>
        }

      </div>
    )
  }
}

InvoiceHomestay.propTypes = {
  dispatch: PropTypes.func,
  invoice: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  routeParams: PropTypes.object,
}
