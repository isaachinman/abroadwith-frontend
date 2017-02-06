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
import { updateRoomSearchParams, updateActiveRoom } from 'redux/modules/ui/search/homestaySearch'

// Relative imports
import styles from '../Homestay.styles'

// Extend moment
const moment = extendMoment(Moment)

@connect(
  state => ({
    auth: state.auth,
    homestaySearch: state.uiPersist.homestaySearch,
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

  handleRoomChange = roomID => {
    this.props.dispatch(updateActiveRoom(roomID))
    this.props.handleRoomDropdownChange(false)
  }

  determineBlockedStatus = day => {

    return this.props.roomCalendars[this.props.homestaySearch.activeRoom].data.unavailabilities.some(blockedRange => {

      return moment.range(moment(blockedRange.start), moment(blockedRange.end)).contains(day)

    })

  }

  render() {

    const { auth, handleRoomDropdownChange, homestaySearch, t, rooms, roomSelectionOpen, roomCalendars } = this.props

    const determineBlockedStatus = this.props.roomCalendars[homestaySearch.activeRoom] && this.props.roomCalendars[homestaySearch.activeRoom].data && this.props.roomCalendars[homestaySearch.activeRoom].data.unavailabilities ? this.determineBlockedStatus : () => false

    const alphabeticalRooms = rooms.sort((a, b) => {
      const x = a.name.toLowerCase()
      const y = b.name.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0 // eslint-disable-line
    })

    return (
      <SpinLoader show={roomCalendars.loading}>
        <span style={styles.bookNowContainer} className='book-now-panel'>
          <Row style={styles.bookNowBorderBottom}>
            <Col xs={12}>
              <DateRangePicker
                startDate={homestaySearch.params.arrival ? moment(homestaySearch.params.arrival) : null}
                endDate={homestaySearch.params.departure ? moment(homestaySearch.params.departure) : null}
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
            <Col xs={12} style={styles.alignLeft}>
              <Select
                theme='bootstrap3'
                className='book-now-room-select'
                value={rooms.filter(room => room.id === homestaySearch.activeRoom)[0] ? { value: homestaySearch.activeRoom, label: rooms.filter(room => room.id === homestaySearch.activeRoom)[0].name } : {}}
                onValueChange={event => this.handleRoomChange(event ? event.value : null)}
                open={roomSelectionOpen}
                onBlur={() => handleRoomDropdownChange(false)}
                onFocus={() => handleRoomDropdownChange(true)}
              >
                {alphabeticalRooms.map(room => <option key={`room-${room.id}-${room.name}`} value={room.id}>{room.name}</option>)}
              </Select>
            </Col>
          </Row>
          <Row style={styles.bookNowBorderBottom}>
            <Col xs={12} style={styles.alignLeft}>
              <p>
                <strong className='header-green'>{t('common.Price')}:</strong>
                <span className='pull-right'>
                  {homestaySearch.params.arrival && homestaySearch.params.departure && !auth.loaded &&
                    <a>{t('common.log_in_to_see_prices')}</a>
                  }
                  {(!homestaySearch.params.arrival || !homestaySearch.params.departure) &&
                    <span>per week</span>
                  }
                </span>
              </p>
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
  auth: PropTypes.object,
  dispatch: PropTypes.func,
  handleRoomDropdownChange: PropTypes.func,
  homestaySearch: PropTypes.object,
  rooms: PropTypes.array,
  roomSelectionOpen: PropTypes.bool,
  roomCalendars: PropTypes.object,
  t: PropTypes.func,
}
