// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Panel } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'

// Relative imports
import styles from '../PaymentMethods.styles'

@connect(state => ({
  jwt: state.auth.token,
  user: state.privateData.user.data,
}))
@translate()
export default class PayPal extends Component {

  render() {

    const { t, email, id, insideBooking, deletePaymentMethod } = this.props

    return (
      <Col xs={12} md={8} lg={6}>
        <Panel style={insideBooking ? Object.assign({}, styles.panel, { boxShadow: 'none' }) : styles.panel}>
          <h6 style={styles.email}>{email}</h6>
          <div className='text-muted'>{t('common.Connected')}</div>
          <div style={styles.bottomRow}>
            <a style={styles.removeBtn} onClick={() => deletePaymentMethod(id)}>{t('common.Remove')}</a>
            <span style={styles.typeIcon}><FontAwesome className='header-blue' name='cc-paypal' size='2x' /></span>
          </div>
        </Panel>
      </Col>
    )
  }
}

PayPal.propTypes = {
  email: PropTypes.string,
  id: PropTypes.number,
  insideBooking: PropTypes.bool,
  deletePaymentMethod: PropTypes.func,
  t: PropTypes.func,
}
