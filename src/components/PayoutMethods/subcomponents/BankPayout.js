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
export default class BankPayout extends Component {

  render() {

    const { t, id, isDefault, routingAccountNumber, deletePayoutMethod, setPayoutMethodDefault } = this.props

    return (
      <Col xs={12} md={6} lg={4}>
        <Panel style={styles.panel}>
          <div>XXXXXXXXXXXX{routingAccountNumber}</div>
          <div>{t('common.Bank_account')}</div>
          <div>{isDefault ? <span>{t('common.Default')}</span> : <a onClick={() => setPayoutMethodDefault(id)}>{t('common.Set_as_default')}</a>}</div>
          <div style={styles.bottomRow}>
            <div style={styles.floatLeft}>
              <div><a style={styles.removeBtn} onClick={() => deletePayoutMethod(id)}>{t('common.Remove')}</a></div>
            </div>
            <div style={styles.floatRight}>
              <span style={styles.typeIcon}><FontAwesome name='credit-card-alt' /></span>
            </div>
          </div>
        </Panel>
      </Col>
    )
  }
}

BankPayout.propTypes = {
  id: PropTypes.number,
  isDefault: PropTypes.bool,
  routingAccountNumber: PropTypes.string,
  t: PropTypes.func,
  deletePayoutMethod: PropTypes.func,
  setPayoutMethodDefault: PropTypes.func,
}
