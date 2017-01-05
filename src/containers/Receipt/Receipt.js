// Absolute imports
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { loadReceipt } from 'redux/modules/privateData/receipts/receipts'
import Helmet from 'react-helmet'
import React, { Component } from 'react'

@asyncConnect([{
  deferred: false,
  promise: ({ params, store: { dispatch, getState } }) => {

    return Promise.resolve(dispatch(loadReceipt(getState().auth.token, params.bookingID)))

  },
}])
@connect(
  (state, ownProps) => ({
    debug: ownProps,
    data: state.privateData.receipts[ownProps.params.bookingID],
  })
)
export default class Receipt extends Component {
  render() {

    console.log(this)

    const {
      booking,
      receipt,
    } = this.props.data

    return (
      <div>

        <Helmet title='Receipt' />

        <div>
          {booking.id}
        </div>
        <div>
          {receipt.id}
        </div>

      </div>
    )
  }
}

Receipt.propTypes = {
  data: React.PropTypes.object,
  loading: React.PropTypes.bool,
  user: React.PropTypes.object,
  error: React.PropTypes.object,
}
