// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Panel } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'

// Relative imports
import styles from '../PayoutMethods.styles'

@connect(state => ({
  jwt: state.auth.token,
  user: state.privateData.user.data,
}))
@translate()
export default class PayPalPayout extends Component {

  render() {

    const { t, email, id, isDefault, deletePayoutMethod, setPayoutMethodDefault } = this.props

    return (
      <Col xs={12} md={6} lg={4}>
        <Panel style={styles.panel}>
          <div style={styles.email}>{email}</div>
          <div style={styles.connected}>{t('common.Connected')}</div>
          <div>{isDefault ? <span>{t('common.Default')}</span> : <a onClick={() => setPayoutMethodDefault(id)}>{t('common.Set_as_default')}</a>}</div>
          <div style={styles.bottomRow}>
            <div style={styles.floatLeft}>
              <div><a style={styles.removeBtn} onClick={() => deletePayoutMethod(id)}>{t('common.Remove')}</a></div>
            </div>
            <div style={styles.floatRight}>
              <span style={styles.typeIcon}><FontAwesome name='cc-paypal' /></span>
            </div>
          </div>
        </Panel>
      </Col>
    )
  }
}

PayPalPayout.propTypes = {
  email: PropTypes.string,
  id: PropTypes.number,
  isDefault: PropTypes.bool,
  deletePayoutMethod: PropTypes.func,
  setPayoutMethodDefault: PropTypes.func,
  t: PropTypes.func,
}
