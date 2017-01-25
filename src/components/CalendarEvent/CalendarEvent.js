/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-string-refs */
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { translate } from 'react-i18next'
import { Link } from 'react-router'
import { Row, Col, Button, Overlay, Popover } from 'react-bootstrap'
import { uiDate } from 'utils/dates'
import config from 'config'

// Styles
const styles = {
  truncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  default: {
    padding: '0 3px',
    fontSize: 14,
    borderRadius: 5,
  },
  UNAVAILABLE: {
    background: 'rgba(252, 80, 80, .7)',
  },
  RESERVATION: {
    color: '#404041',
    position: 'relative',
    background: 'white',
    boxShadow: '5px 5px 12px 0 rgba(0,0,0,0.15)',
    padding: 5,
    marginTop: 5,
    textIndent: 35,
  },
  reservationHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  img: {
    position: 'absolute',
    left: 5,
    width: 30,
    height: 30,
    top: -5,
    borderRadius: '50%',
  },
}

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

    const combinedStyle = Object.assign({}, styles.default, styles[event.type])

    return (
      <div ref='target' onClick={this.toggle} style={combinedStyle}>
        {event.type === 'RESERVATION' &&
          <div style={styles.truncate}>
            <img src={`${config.img}${event.img}`} style={styles.img} alt={event.img} />
            {event.title}
            <Overlay
              target={() => ReactDOM.findDOMNode(this.refs.target)}
              placement='top'
              rootClose
              onHide={() => this.setState({ popup: false })}
              show={this.state.popup}
            >
              <Popover
                id={`popover${title}${uiDate(event.start)}${uiDate(event.end)}`}
              >
                <Row>
                  <Col xs={12}>
                    <div style={styles.reservationHeader} dangerouslySetInnerHTML={{
                      __html: t('trips.reservation_with', { immersion: t(`immersions.${event.immersionType}`), guest: event.guestName }),
                    }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    {uiDate(event.start)} - {uiDate(event.end)}
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Link to='/reservations'>
                      <Button bsStyle='primary' block>{t('reservations.title')}</Button>
                    </Link>
                  </Col>
                </Row>
              </Popover>
            </Overlay>
          </div>
        }
        {event.type === 'UNAVAILABLE' &&
          <div style={styles.truncate}>
            {event.title}
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
                    <Button onClick={() => this.removeBlockedRange(event.roomID, event.slotID)} bsStyle='danger' block>{t('common.words.delete')}</Button>
                  </Col>
                </Row>
              </Popover>
            </Overlay>
          </div>
        }
      </div>

    )
  }
}

CalendarEvent.propTypes = {
  removeBlockedRange: PropTypes.func,
  t: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.string,
  event: PropTypes.object,
}
