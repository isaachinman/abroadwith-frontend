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
export default class CreditCard extends Component {

  render() {

    const { t, id, lastFour, expiry, deletePaymentMethod } = this.props

    return (
      <Col xs={12} md={6} lg={4}>
        <Panel style={styles.panel}>
          <div>XXXXXXXXXXXX{lastFour}</div>
          <div>{expiry}</div>
          <div style={styles.bottomRow}>
            <a style={styles.removeBtn} onClick={() => deletePaymentMethod(id)}>{t('common.Remove')}</a>
            <span style={styles.typeIcon}><FontAwesome name='credit-card-alt' /></span>
          </div>
        </Panel>
      </Col>
    )
  }
}

CreditCard.propTypes = {
  id: PropTypes.number,
  expiry: PropTypes.string,
  lastFour: PropTypes.string,
  deletePaymentMethod: PropTypes.func,
  t: PropTypes.func,
}
