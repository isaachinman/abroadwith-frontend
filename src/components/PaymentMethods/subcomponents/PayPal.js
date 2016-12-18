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

    const { t, email, id, deletePaymentMethod } = this.props

    return (
      <Col xs={12} md={6} lg={3}>
        <Panel style={styles.panel}>
          <div style={styles.email}>{email}</div>
          <div style={styles.connected}>{t('common.Connected')}</div>
          <div style={styles.bottomRow}>
            <a style={styles.removeBtn} onClick={() => deletePaymentMethod(id)}>{t('common.Remove')}</a>
            <span style={styles.typeIcon}><FontAwesome name='cc-paypal' /></span>
          </div>
        </Panel>
      </Col>
    )
  }
}

PayPal.propTypes = {
  email: PropTypes.string,
  id: PropTypes.number,
  deletePaymentMethod: PropTypes.func,
  t: PropTypes.func,
}
