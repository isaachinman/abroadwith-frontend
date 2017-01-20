// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import Switch from 'antd/lib/switch'

// Relative imports
import styles from './ManageNotifications.styles'

@translate()
export default class ManageNotifications extends Component {

  changeNotificationPreference = (category, type) => {
    const newObject = this.props.user
    newObject.notifications[category][type] = !newObject.notifications[category][type]
    this.props.updateUser(newObject)
  }

  render() {

    const {
      user,
      t,
    } = this.props

    return (
      <span>
        <Row>
          <Col xs={12}>
            <h5>{t('admin.notifications_email')}</h5>
          </Col>
          <Col xs={12}>
            <Switch
              onChange={() => this.changeNotificationPreference('email', 'reminders')}
              defaultChecked={user.notifications.email.reminders}
            />
            <div style={styles.switchLabel}>{t('admin.notifications_reservations')}</div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Switch
              onChange={() => this.changeNotificationPreference('email', 'promotion')}
              defaultChecked={user.notifications.email.promotion}
            />
            <div style={styles.switchLabel}>{t('admin.notifications_promotion')}</div>
          </Col>
        </Row>
      </span>
    )
  }
}

ManageNotifications.propTypes = {
  updateUser: PropTypes.func,
  user: PropTypes.object,
  t: PropTypes.func,
}
