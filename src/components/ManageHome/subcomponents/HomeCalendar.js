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

/* eslint-disable */
const events = [
  {
    'title': 'All Day Event',
    'allDay': true,
    'start': new Date(2015, 3, 0),
    'end': new Date(2015, 3, 1),
  },
  {
    'title': 'Long Event',
    'start': new Date(2015, 3, 7),
    'end': new Date(2015, 3, 10),
  },

  {
    'title': 'DTS STARTS',
    'start': new Date(2016, 2, 13, 0, 0, 0),
    'end': new Date(2016, 2, 20, 0, 0, 0),
  },

  {
    'title': 'DTS ENDS',
    'start': new Date(2016, 10, 6, 0, 0, 0),
    'end': new Date(2016, 10, 13, 0, 0, 0),
  },

  {
    'title': 'Some Event',
    'start': new Date(2015, 3, 9, 0, 0, 0),
    'end': new Date(2015, 3, 9, 0, 0, 0),
  },
  {
    'title': 'Conference',
    'start': new Date(2015, 3, 11),
    'end': new Date(2015, 3, 13),
    desc: 'Big conference for important people',
  },
  {
    'title': 'Meeting',
    'start': new Date(2015, 3, 12, 10, 30, 0, 0),
    'end': new Date(2015, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    'title': 'Lunch',
    'start': new Date(2015, 3, 12, 12, 0, 0, 0),
    'end': new Date(2015, 3, 12, 13, 0, 0, 0),
    desc: 'Power lunch',
  },
  {
    'title': 'Meeting',
    'start': new Date(2015, 3, 12, 14, 0, 0, 0),
    'end': new Date(2015, 3, 12, 15, 0, 0, 0),
  },
  {
    'title': 'Happy Hour',
    'start': new Date(2015, 3, 12, 17, 0, 0, 0),
    'end': new Date(2015, 3, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day',
  },
  {
    'title': 'Dinner',
    'start': new Date(2015, 3, 12, 20, 0, 0, 0),
    'end': new Date(2015, 3, 12, 21, 0, 0, 0),
  },
  {
    'title': 'Birthday Party',
    'start': new Date(2015, 3, 13, 7, 0, 0),
    'end': new Date(2015, 3, 13, 10, 30, 0),
  },
]
/* eslint-enable */

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
    console.log(slotInfo)
  }

  render() {

    console.log(this)

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
