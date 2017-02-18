// Absolute imports
import React, { Component, PropTypes } from 'react'
import { apiDate } from 'utils/dates'
import { Button, Col, FormControl, FormGroup, Row } from 'react-bootstrap'
import { createNewThreadWithHost } from 'redux/modules/privateData/messaging/messaging'
import { connect } from 'react-redux'
import { DateRangePicker, SpinLoader } from 'components'
import moment from 'moment'
import notification from 'antd/lib/notification'
import { translate } from 'react-i18next'

// Relative imports
import styles from './SendNewMessageToHost.styles'

@connect(
  state => ({
    newThread: state.messaging.newThread,
    token: state.auth.token,
  })
)
@translate()
export default class SendNewMessageToHost extends Component {

  state = {
    arrival: this.props.startDate || null,
    departure: this.props.endDate || null,
    homeId: this.props.homeID,
    message: null,
  }

  handleDatesChange = value => {

    // The dates input returns both dates at once
    this.setState({
      arrival: value.startDate ? apiDate(value.startDate) : null,
      departure: value.endDate ? apiDate(value.endDate) : null,
    })

  }

  handleMessageChange = event => this.setState({ message: event.target.value })

  validateForm = () => Object.keys(this.state).some(value => !this.state[value])

  sendMessage = () => {
    const { dispatch, t, token } = this.props
    dispatch(createNewThreadWithHost(token, this.state, () => {
      notification.success({
        duration: 2000,
        message: <strong>{t('common.message_sent_toast')}</strong>,
        description: t('inbox.user_will_receive_email_notification'),
      })
    }))
  }

  render() {

    const { arrival, departure, message } = this.state
    const { t, newThread } = this.props

    console.log(this)

    return (
      <SpinLoader show={newThread.loading}>
        <div>
          <Row>
            <Col xs={12}>
              <h6>{t('inbox.when_are_you_travelling')}</h6>
            </Col>
            <Col xs={12}>
              <DateRangePicker
                startDate={arrival ? moment(arrival) : null}
                endDate={departure ? moment(departure) : null}
                endDatePlaceholderText={t('common.Arrival')}
                startDatePlaceholderText={t('common.Departure')}
                onDatesChange={this.handleDatesChange}
                inlineBlock
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup controlId='new-thread'>
                <FormControl
                  componentClass='textarea'
                  placeholder={t('inbox.message_modal_placeholder')}
                  style={styles.textarea}
                  onChange={this.handleMessageChange}
                  value={message || ''}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button onClick={this.sendMessage} disabled={this.validateForm()} bsStyle='success'>{t('inbox.message_modal_btn')}</Button>
            </Col>
          </Row>
        </div>
      </SpinLoader>
    )
  }

}

SendNewMessageToHost.propTypes = {
  dispatch: PropTypes.func,
  homeID: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  newThread: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
