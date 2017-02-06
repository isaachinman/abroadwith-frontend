// Absolute imports
import React, { Component, PropTypes } from 'react'
import { apiDate } from 'utils/dates'
import { Button, Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { DateRangePicker, SpinLoader } from 'components'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { SimpleSelect as Select } from 'react-selectize'
import { translate } from 'react-i18next'
import { updateRoomSearchParams } from 'redux/modules/ui/search/homestaySearch'

// Relative imports
import styles from '../Homestay.styles'

// Extend moment
const moment = extendMoment(Moment)

@connect(
  state => ({
    homestaySearch: state.uiPersist.homestaySearch.params,
  })
)
@translate()
export default class BookNow extends Component {

  handleDatesChange = value => {

    const { dispatch, homestaySearch } = this.props

    // The dates input returns both dates at once
    const newParams = Object.assign({}, homestaySearch, {
      arrival: value.startDate ? apiDate(value.startDate) : null,
      departure: value.endDate ? apiDate(value.endDate) : null,
    })

    dispatch(updateRoomSearchParams(newParams))

  }

  determineBlockedStatus = day => {

    return this.props.roomCalendars[this.props.activeRoom].data.unavailabilities.some(blockedRange => {

      return moment.range(moment(blockedRange.start), moment(blockedRange.end)).contains(day)

    })

  }

  render() {

    const { activeRoom, homestaySearch, t, rooms, roomCalendars } = this.props

    const determineBlockedStatus = this.props.roomCalendars[this.props.activeRoom] && this.props.roomCalendars[this.props.activeRoom].data ? this.determineBlockedStatus : () => false

    console.log('roomCalendars: ', roomCalendars)

    return (
      <SpinLoader show={roomCalendars && activeRoom && roomCalendars[activeRoom] ? roomCalendars[activeRoom].loading : true}>
        <span style={styles.bookNowContainer}>
          <Row style={styles.bookNowBorderBottom}>
            <Col xs={12}>
              <DateRangePicker
                startDate={homestaySearch.arrival ? moment(homestaySearch.arrival) : null}
                endDate={homestaySearch.departure ? moment(homestaySearch.departure) : null}
                inlineBlock
                large
                startDatePlaceholderText={t('common.Arrival')}
                endDatePlaceholderText={t('common.Departure')}
                isDayBlocked={determineBlockedStatus}
                scrollToPosition={false}
                onDatesChange={this.handleDatesChange}
              />
            </Col>
          </Row>
          <Row style={styles.bookNowBorderBottom}>
            <Col xs={12}>
              <Select
                theme='bootstrap3'
                className='book-now-room-select'
                value={rooms.filter(room => room.id === activeRoom)[0] ? { value: activeRoom, label: rooms.filter(room => room.id === activeRoom)[0].name } : {}}
              >
                {rooms.map(room => <option key={`room-${room.id}-${room.name}`} value={room.id}>{room.name}</option>)}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button style={styles.bookNowButton} block bsStyle='success' bsSize='large'>Book now</Button>
            </Col>
          </Row>
        </span>
      </SpinLoader>
    )
  }
}

BookNow.propTypes = {
  activeRoom: PropTypes.number,
  dispatch: PropTypes.func,
  homestaySearch: PropTypes.object,
  rooms: PropTypes.array,
  roomCalendars: PropTypes.object,
  t: PropTypes.func,
}
