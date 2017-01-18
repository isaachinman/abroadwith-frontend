// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Button, Col, ControlLabel, FormControl, FormGroup, Modal, Row } from 'react-bootstrap'
import { loadHomestayCalendar, updateRoomCalendar } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import BigCalendar from 'react-big-calendar'
import { DateRangePicker } from 'components'
import CalendarEvent from 'components/CalendarEvent/CalendarEvent'
import flattenTimeslotIntoArray from 'utils/dates/flattenTimeslotIntoArray'
import { apiDate } from 'utils/dates'
import Loader from 'react-loader-advanced'
import moment from 'moment'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

// Styles
const styles = {
  calendarContainer: {
    height: 'calc(100vh - 250px)',
    minHeight: 400,
  },
}

@connect(
  (state, ownProps) => ({
    home: state.privateData.homes ? state.privateData.homes[ownProps.homeID] : {},
    token: state.auth.token,
  }),
)
@translate()
export default class HomeCalendar extends Component {  // eslint-disable-line

  state = {
    confirmationModalOpen: false,
    roomsToUpdate: 'all',
    potentialBlockedRange: {
      start: null,
      end: null,
    },
  }

  componentDidMount = () => {
    const { home } = this.props
    if (home && (!home.calendar || !home.calendar.data)) {
      this.refreshCalendar()
    }
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.home && this.props.home.calendar && this.props.home.calendar.roomsLoading > 0 && nextProps.home.calendar.roomsLoading === 0) {
      // Rooms are done loading, refetch calendar
      this.refreshCalendar()
    }
  }

  refreshCalendar = () => {
    const { dispatch, homeID, token } = this.props
    dispatch(loadHomestayCalendar(token, homeID))
  }

  closeConfirmationModal = () => this.setState({ confirmationModalOpen: false })

  handlePotentialDatesChange = range => {
    const { potentialBlockedRange } = this.state
    const newRange = {
      start: range.startDate || potentialBlockedRange.start,
      end: range.endDate || potentialBlockedRange.end,
    }
    this.setState({ potentialBlockedRange: newRange })
  }

  handleSlotSelect = slotInfo => {

    const yesterday = moment().startOf('day').add(-1, 'days')
    const slotStart = moment(slotInfo.start)
    const slotEnd = moment(slotInfo.end)

    // Timeslots can only be added in the future
    if (slotStart.isAfter(yesterday) && slotEnd.isAfter(yesterday)) {
      this.setState({
        potentialBlockedRange: {
          start: slotStart,
          end: slotEnd,
        },
        confirmationModalOpen: true,
      })
    }

  }

  updateRoomCalendar = (roomID, calendar) => {

    const { dispatch, token, homeID } = this.props
    dispatch(updateRoomCalendar(token, homeID, roomID, calendar))

  }

  addBlockedRange = () => {

    const { start, end } = this.state.potentialBlockedRange
    const { home } = this.props
    const { rooms } = home.data

    const roomsToUpdate = this.state.roomsToUpdate === 'all' ? rooms.map(room => room.id) : [parseInt(this.state.roomsToUpdate)]

    // Loop through all rooms to be changed
    roomsToUpdate.map(room => {

      // Create new timeslot object
      const newTimeslot = {
        startDate: apiDate(start),
        endDate: apiDate(end),
      }

      // Find room calendar out of current state
      const existingArray = home.calendar.data.roomAvailabilityCalendars.filter(roomCalendar => roomCalendar.roomId === room)[0].unavailablePeriods

      // Flatten new timeslot into existing calendar
      const flattenedCalendar = flattenTimeslotIntoArray(newTimeslot, existingArray)

      // Update room calendar
      this.updateRoomCalendar(room, flattenedCalendar)

    })

    this.setState({ confirmationModalOpen: false })

  }

  removeBlockedRange = (roomID, slotID) => {
    const roomCalendar = this.props.home.calendar.data.roomAvailabilityCalendars.filter(roomCal => roomCal.roomId === roomID)[0]
    const newCalendar = roomCalendar.unavailablePeriods.filter(slot => slot.id !== slotID)
    this.updateRoomCalendar(roomID, newCalendar)
  }

  renderEvent = eventProps => {
    return <CalendarEvent {...eventProps} removeBlockedRange={this.removeBlockedRange} />
  }

  render() {

    const { confirmationModalOpen, roomsToUpdate, potentialBlockedRange } = this.state
    const { home, t } = this.props
    const { calendar } = this.props.home

    console.log(this)

    const events = []

    if (calendar && calendar.data) {
      calendar.data.roomAvailabilityCalendars.map(roomCal => {
        roomCal.unavailablePeriods.map(unavailablePeriod => {
          events.push({
            title: `${home.data.rooms.filter(room => room.id === roomCal.roomId)[0].name} ${t('home_calendar.is_unavailable')}`,
            start: moment(unavailablePeriod.startDate),
            end: moment(unavailablePeriod.endDate).add(1, 'minutes'),
            roomID: roomCal.roomId,
            slotID: unavailablePeriod.id,
          })
        })
      })
    }

    const isLoading = home.loading === true || (typeof home.calendar === 'object' && (home.calendar.loading === true || home.calendar.roomsLoading > 0))

    /* eslint-disable */
    return (
      <span>
        <Row>
          <Col xs={12}>
            <Loader show={isLoading} message={t('common.Loading')}>
              <div style={styles.calendarContainer}>
                <BigCalendar
                  selectable
                  components={{ event: this.renderEvent }}
                  removeBlockedRange={this.removeBlockedRange}
                  events={events}
                  defaultView='month'
                  defaultDate={new Date()}
                  onSelectSlot={this.handleSlotSelect}
                  views={['month', 'agenda']}
                />
              </div>
            </Loader>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p className='text-muted'>{t('home_calendar.disable_dates_explanation')}</p>
          </Col>
        </Row>
        {home && home.data && home.data.rooms && home.data.rooms.length > 0 &&
          <Modal
            backdrop='static'
            bsSize='small'
            show={confirmationModalOpen}
            onHide={this.closeConfirmationModal}
          >
            <Modal.Header closeButton>
              <Modal.Title>{t('home_calendar.selection_modal_title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col xs={12}>
                  <FormGroup controlId='formControlsSelect'>
                    <ControlLabel>Select</ControlLabel>
                    <FormControl
                      componentClass='select'
                      placeholder='select'
                      value={roomsToUpdate}
                      onChange={event => this.setState({ roomsToUpdate: event.target.value })}
                    >
                      <option value='all'>{t('home_calendar.all_rooms')}</option>
                      {home.data.rooms.map(room => {
                        return (
                          <option value={room.id} key={`pauseroom${room.id}`}>{room.name}</option>
                        )
                      })}
                    </FormControl>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>{t('common.Dates')}</ControlLabel>
                    <DateRangePicker
                      startDate={potentialBlockedRange.start}
                      endDate={potentialBlockedRange.end}
                      onDatesChange={this.handlePotentialDatesChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>{t('home_calendar.availability')}</ControlLabel>
                    <FormControl.Static>
                      {t('home_calendar.unavailable')}
                    </FormControl.Static>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Button onClick={this.addBlockedRange} bsStyle='primary'>{t('home_calendar.save_details')}</Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        }
      </span>
    )
  }
}

HomeCalendar.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  homeID: PropTypes.string,
  t: PropTypes.func,
  token: PropTypes.string,
}
