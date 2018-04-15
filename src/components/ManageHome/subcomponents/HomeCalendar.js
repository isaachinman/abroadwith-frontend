// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Alert, Button, Col, ControlLabel, FormControl, FormGroup, Modal, OverlayTrigger, Tooltip, Row } from 'react-bootstrap'
import { loadHomestayCalendar, updateRoomCalendar, resolveRoomAvailabilityConflicts } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { toggleHomePausing } from 'redux/modules/privateData/homes/homeManagement'
import { loadReservations } from 'redux/modules/privateData/reservations/reservations'
import BigCalendar from 'react-big-calendar'
import { DateRangePicker, SpinLoader } from 'components'
import FontAwesome from 'react-fontawesome'
import BackgroundWrapper from 'components/CalendarEvent/BackgroundWrapper'
import CalendarEvent from 'components/CalendarEvent/CalendarEvent'
import Switch from 'antd/lib/switch'
import flattenTimeslotIntoArray from 'utils/dates/flattenTimeslotIntoArray'
import { apiDate } from 'utils/dates'
import { Link } from 'react-router'
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
    reservations: state.privateData.reservations,
  }),
)
@translate()
export default class HomeCalendar extends Component {  // eslint-disable-line

  state = {
    confirmationModalOpen: false,
    conflictModalOpen: false,
    roomsToUpdate: 'all',
    potentialBlockedRange: {
      start: null,
      end: null,
    },
  }

  componentDidMount = () => {
    const { dispatch, token, home } = this.props
    if (home && (!home.calendar || !home.calendar.data)) {
      this.refreshCalendar()
      dispatch(loadReservations(token))
    }
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.home && this.props.home.calendar) {

      if (this.props.home.calendar.roomsLoading > 0 && nextProps.home.calendar.roomsLoading === 0) {
        // Rooms are done loading, refetch calendar
        this.refreshCalendar()
      }

      if (nextProps.home.calendar && nextProps.home.calendar.conflicts.length > 0) {
        this.setState({ conflictModalOpen: true })
      }

    }
  }

  refreshCalendar = () => {
    const { dispatch, homeID, token } = this.props
    dispatch(loadHomestayCalendar(token, homeID))
  }

  closeConfirmationModal = () => this.setState({ confirmationModalOpen: false })
  closeConflictModal = () => this.setState({ conflictModalOpen: false }, () => this.props.dispatch(resolveRoomAvailabilityConflicts(this.props.homeID)))

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

  toggleHomePausing = pausingStatus => {
    const { dispatch, homeID, token } = this.props
    dispatch(toggleHomePausing(token, homeID, pausingStatus))
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

    const { confirmationModalOpen, conflictModalOpen, roomsToUpdate, potentialBlockedRange } = this.state
    const { home, reservations, t } = this.props
    const { calendar } = this.props.home

    const events = []

    if (calendar && calendar.data) {
      calendar.data.roomAvailabilityCalendars.map(roomCal => {
        roomCal.unavailablePeriods.map(unavailablePeriod => {
          events.push({
            type: 'UNAVAILABLE',
            title: `${home.data.rooms.filter(room => room.id === roomCal.roomId)[0].name} ${t('home_calendar.is_unavailable')}`,
            start: moment(unavailablePeriod.startDate),
            end: moment(unavailablePeriod.endDate).add(1, 'minutes'),
            roomID: roomCal.roomId,
            slotID: unavailablePeriod.id,
          })
        })
      })
    }

    if (reservations && reservations.data) {
      reservations.data.map(reservation => {
        if (reservation.homeId === this.props.homeID && reservation.status === 'APPROVED') {
          events.push({
            type: 'RESERVATION',
            title: `${reservation.guestName} (${reservation.roomName})`,
            img: reservation.guestPhoto,
            guestName: reservation.guestName,
            immersionType: reservation.immersionType,
            start: moment(reservation.arrivalDate),
            end: moment(reservation.departureDate),
          })
        }
      })
    }

    const calendarLocale = {
      allDay: t('common.all_day'),
      previous: t('common.previousMonth'),
      next: t('common.nextMonth'),
      today: t('common.today'),
      month: t('common.month'),
      agenda: t('common.agenda'),
    }

    const isLoading = home.loading === true ||
                      (typeof home.calendar === 'object' && (home.calendar.loading === true || home.calendar.roomsLoading > 0)) ||
                      (typeof reservations === 'object' && reservations.loading === true)

    return (
      <span>
        <Row>
          <Col xs={12}>
            <SpinLoader show={isLoading}>
              <div style={styles.calendarContainer}>
                <BigCalendar
                  allDayAccessor={() => true}
                  messages={calendarLocale}
                  selectable
                  components={{ event: this.renderEvent, dateCellWrapper: BackgroundWrapper }}
                  removeBlockedRange={this.removeBlockedRange}
                  events={events}
                  defaultView='month'
                  defaultDate={new Date()}
                  onSelectSlot={this.handleSlotSelect}
                  views={['month']}
                />
              </div>
            </SpinLoader>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={8} md={9} lg={10}>
            <p className='text-muted'>{t('home_calendar.disable_dates_explanation')}</p>
          </Col>
          <Col xs={12} sm={4} md={3} lg={2}>
            {calendar && calendar.data &&
              <div>
                <Switch
                  onChange={pausedStatus => this.toggleHomePausing(!pausedStatus)}
                  unCheckedChildren={t('home_calendar.unlisted')}
                  checkedChildren={t('home_calendar.listed')}
                  checked={!calendar.data.isPaused}
                />
                <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip'>{t('home_calendar.pausing_explanation')}</Tooltip>}>
                  <FontAwesome name='question-circle' style={{ margin: '0 5px', paddingTop: 2 }} className='text-muted' />
                </OverlayTrigger>
              </div>
            }
          </Col>
        </Row>
        {home && home.data && home.data.rooms && home.data.rooms.length > 0 && home.calendar &&
          <span>
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
                        {home.data.rooms.sort((a, b) => {
                          const x = a.name.toLowerCase()
                          const y = b.name.toLowerCase()
                          return x < y ? -1 : x > y ? 1 : 0 // eslint-disable-line
                        }).map(room => {
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
            <Modal
              backdrop='static'
              bsSize='small'
              show={conflictModalOpen}
              onHide={this.closeConflictModal}
            >
              <Modal.Header closeButton>
                <Modal.Title>{t('home_calendar.availability_conflict_title')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {home.calendar.conflicts.map(conflictID => {
                  return (
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                      <Row>
                        <Col xs={12}>
                          <p dangerouslySetInnerHTML={{
                            __html: t('home_calendar.cannot_make_this_period_unavailable', {
                              roomName: this.props.home.data.rooms.filter(room => room.id === conflictID)[0].name,
                            }),
                          }}
                          />
                          <p dangerouslySetInnerHTML={{ __html: t('home_calendar.please_go_to_reservations', { openLink: '', closeLink: '' }) }} />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <Link to='/reservations'><Button bsStyle='danger'>{t('common.navbar_reservations')}</Button></Link>
                          <span> {t('common.words.or')} </span>
                          <Button onClick={this.closeConflictModal}>{t('common.hide_alert')}</Button>
                        </Col>
                      </Row>
                    </Alert>
                  )
                })
                }
              </Modal.Body>
            </Modal>
          </span>
        }
      </span>
    )
  }
}

HomeCalendar.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  homeID: PropTypes.number,
  reservations: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
