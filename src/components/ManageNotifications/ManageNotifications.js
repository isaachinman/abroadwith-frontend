// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Checkbox, Col, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'

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
      <Row>
        <Col xs={12}>
          <strong>{t('admin.notifications_email')}</strong>

          <Checkbox
            onChange={() => this.changeNotificationPreference('email', 'reminders')}
            defaultChecked={user.notifications.email.reminders}
          >
            {t('admin.notifications_reservations')}
          </Checkbox>
          <Checkbox
            onChange={() => this.changeNotificationPreference('email', 'promotion')}
            defaultChecked={user.notifications.email.promotion}
          >
            {t('admin.notifications_promotion')}
          </Checkbox>

        </Col>

      </Row>
    )
  }
}

ManageNotifications.propTypes = {
  updateUser: PropTypes.func,
  user: PropTypes.object,
  t: PropTypes.func,
}
