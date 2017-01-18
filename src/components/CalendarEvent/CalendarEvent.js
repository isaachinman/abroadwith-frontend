/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-string-refs */

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { translate } from 'react-i18next'
import { Row, Col, Button, Overlay, Popover } from 'react-bootstrap'
import { uiDate } from 'utils/dates'

@translate()
export default class CalendarEvent extends Component {

  state = {
    popup: false,
  }

  toggle = () => {
    this.setState({ popup: !this.state.popup })
  }

  removeBlockedRange = (roomID, slotID) => {
    this.props.removeBlockedRange(roomID, slotID)
    this.setState({ popup: false })
  }

  render() {

    const { t, title, event } = this.props

    return (
      <div ref='target' onClick={this.toggle}>
        {this.props.event.title}
        <Overlay
          target={() => ReactDOM.findDOMNode(this.refs.target)}
          placement='top'
          rootClose
          onHide={() => this.setState({ popup: false })}
          show={this.state.popup}
        >
          <Popover id={`popover${title}${uiDate(event.start)}${uiDate(event.end)}`} title={t('home_calendar.period_blocked')}>
            <Row>
              <Col xs={12}>
                {`${title} (${uiDate(event.start)} - ${uiDate(event.end)})`}
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Button onClick={() => this.removeBlockedRange(event.roomID, event.slotID)} bsStyle='danger' block>Delete</Button>
              </Col>
            </Row>
          </Popover>
        </Overlay>
      </div>

    )
  }
}

CalendarEvent.propTypes = {
  removeBlockedRange: PropTypes.func,
  t: PropTypes.func,
  title: PropTypes.string,
  event: PropTypes.object,
}
