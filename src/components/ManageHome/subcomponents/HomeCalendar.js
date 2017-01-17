// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { loadHomestayCalendar } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import BigCalendar from 'react-big-calendar'
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
export default class HomeCalendar extends Component {

  componentDidMount = () => {
    const { dispatch, home, homeID, token } = this.props
    if (home && (!home.calendar || !home.calendar.data)) {
      dispatch(loadHomestayCalendar(token, homeID))
    }
  }

  handleSlotSelect = slotInfo => {
    const now = moment().startOf('day')
    console.log(now, slotInfo)
  }

  render() {

    const { home, t } = this.props
    const { calendar } = this.props.home

    const events = []

    if (calendar && calendar.data) {
      calendar.data.roomAvailabilityCalendars.map(roomCal => {
        roomCal.unavailablePeriods.map(unavailablePeriod => {
          events.push({
            title: `${home.data.rooms.filter(room => room.id === roomCal.roomId)[0].name} ${t('home_calendar.is_unavailable')}`,
            start: moment(unavailablePeriod.startDate),
            end: moment(unavailablePeriod.endDate),
          })
        })
      })
    }

    console.log('events: ', events)

    return (
      <Row>
        <Col xs={12} style={styles.calendarContainer}>
          <BigCalendar
            selectable
            events={events}
            defaultView='month'
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            onSelectEvent={event => console.log(event.title)}
            onSelectSlot={this.handleSlotSelect}
            views={['month', 'agenda']}
          />
        </Col>
      </Row>
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
