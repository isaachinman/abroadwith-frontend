// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap'
import { uiDate } from 'utils/dates'
import { translate } from 'react-i18next'

// Styles
const styles = {
  contentContainer: {
    padding: 30,
    background: 'rgba(0,0,0,.045)',
    marginBottom: -20,
  },
}

@connect()
@translate()
export default class CourseBooking extends Component {

  render() {

    const { activeTripID, changeTrip, t, trips } = this.props

    console.log(trips)

    const tripOptions = Object.keys(trips).map(trip => {
      const booking = trips[trip].bookings[0]
      if (booking.type === 'HOMESTAY') {
        return ({
          id: trip,
          name: (booking.homeAddress && booking.homeAddress.country ?
                  t(`countries.${booking.homeAddress.country}`) : t('common.deleted_home'))
                  + ` (${uiDate(booking.arrivalDate)} ${t('common.words.to')} ${uiDate(booking.departureDate)}) ${t(`trips.status_codes.${booking.status}`)}`,
        })
      } else if (booking.type === 'COURSE') {
        return ({
          id: trip,
          name: (booking.address && booking.address.country ?
                  t(`countries.${booking.address.country}`) : t('common.deleted_account'))
                  + ` (${uiDate(booking.startDate)} ${t('common.words.to')} ${uiDate(booking.startDate)})`,
        })
      }
    })

    return (
      <div style={styles.contentContainer}>
        <FormGroup controlId='trip-selector'>
          <ControlLabel>{t('trips.view_different_trip')}</ControlLabel>
          <FormControl
            componentClass='select'
            onChange={event => changeTrip(event.target.value)}
            value={activeTripID}
          >
            {tripOptions.map(option => <option value={option.id} key={option.id}>{option.name}</option>)}
          </FormControl>
        </FormGroup>
      </div>
    )
  }
}

CourseBooking.propTypes = {
  activeTripID: PropTypes.string,
  changeTrip: PropTypes.func,
  dispatch: PropTypes.func,
  t: PropTypes.func,
  trips: PropTypes.object,
}
