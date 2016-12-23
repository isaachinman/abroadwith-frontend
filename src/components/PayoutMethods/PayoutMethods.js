// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { deletePayoutMethod, setPayoutMethodDefault } from 'redux/modules/payments/payments'

// Relative imports
import AddPayoutMethod from './subcomponents/AddPayoutMethod'
import BankPayout from './subcomponents/BankPayout'
import PayPalPayout from './subcomponents/PayPalPayout'

@connect(state => ({
  jwt: state.auth.token,
  user: state.privateData.user.data,
}))
@translate()
export default class PayoutMethods extends Component {

  setPayoutMethodDefault = payoutMethodID => {
    const { dispatch, jwt } = this.props
    dispatch(setPayoutMethodDefault(jwt, payoutMethodID))
  }

  deletePayoutMethod = payoutMethodID => {
    const { dispatch, jwt } = this.props
    dispatch(deletePayoutMethod(jwt, payoutMethodID))
  }

  render() {

    const { user } = this.props

    return (
      <span>
        <Row>
          {user.payoutMethods.map(payoutMethod => {
            return payoutMethod.type === 'PAYPAL' ?
              <PayPalPayout key={payoutMethod.id} {...payoutMethod} deletePayoutMethod={this.deletePayoutMethod} setPayoutMethodDefault={this.setPayoutMethodDefault} />
              : <BankPayout key={payoutMethod.id} {...payoutMethod} deletePayoutMethod={this.deletePayoutMethod} setPayoutMethodDefault={this.setPayoutMethodDefault} />
          })}
        </Row>
        <Row>
          <AddPayoutMethod {...this.props} />
        </Row>
      </span>
    )
  }
}

PayoutMethods.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
}
