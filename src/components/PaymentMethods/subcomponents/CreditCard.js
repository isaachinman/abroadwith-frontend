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

    const { t, id, insideBooking, lastFour, expiry, deletePaymentMethod } = this.props

    return (
      <Col xs={12} md={8} lg={6}>
        <Panel style={insideBooking ? Object.assign({}, styles.panel, { boxShadow: 'none' }) : styles.panel}>
          <h6>XXXXXXXXXXXX{lastFour}</h6>
          <div className='text-muted'>{expiry}</div>
          <div style={styles.bottomRow}>
            <a style={styles.removeBtn} onClick={() => deletePaymentMethod(id)}>{t('common.Remove')}</a>
            <span style={styles.typeIcon}><FontAwesome className='header-blue' name='credit-card-alt' size='2x' /></span>
          </div>
        </Panel>
      </Col>
    )
  }
}

CreditCard.propTypes = {
  id: PropTypes.number,
  insideBooking: PropTypes.bool,
  expiry: PropTypes.string,
  lastFour: PropTypes.string,
  deletePaymentMethod: PropTypes.func,
  t: PropTypes.func,
}
