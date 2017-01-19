// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { loadInvoice } from 'redux/modules/privateData/invoices/invoices'
import Helmet from 'react-helmet'
import React, { Component } from 'react'

@asyncConnect([{
  deferred: false,
  promise: ({ params, store: { dispatch, getState } }) => {

    return dispatch(loadInvoice(getState().auth.token, params.invoiceID))

  },
}])
@connect(
  (state, ownProps) => ({
    debug: ownProps,
    data: state.privateData.invoices[ownProps.params.invoiceID],
  })
)
export default class Invoice extends Component {
  render() {

    return (
      <div>

        <Helmet title='Invoice' />

        <div>
          invoice
        </div>

      </div>
    )
  }
}

Invoice.propTypes = {
  data: React.PropTypes.object,
  loading: React.PropTypes.bool,
  user: React.PropTypes.object,
  error: React.PropTypes.object,
}
