// Absolute imports
import React, { Component, PropTypes } from 'react'
import { apiDate } from 'utils/dates'
import { Button, Col, OverlayTrigger, Tooltip, Row } from 'react-bootstrap'
import { createPotentialHomestayBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import { connect } from 'react-redux'
import { DateRangePicker, SpinLoader } from 'components'
import Moment from 'moment'
import moize from 'moize'
import { extendMoment } from 'moment-range'
import { openLoginModal } from 'redux/modules/ui/modals'
import { push } from 'react-router-redux'
import { SimpleSelect as Select } from 'react-selectize'
import { translate } from 'react-i18next'
import { updateRoomSearchParams, updateActiveRoom } from 'redux/modules/ui/search/homestaySearch'

// Relative imports
import HomestayPriceCalculator from './HomestayPriceCalculator'
import styles from '../Homestay.styles'

// Extend moment
const moment = extendMoment(Moment)

@connect(
  (state, ownProps) => ({
    auth: state.auth,
    homestay: state.publicData.homestays[ownProps.homeID],
    homestaySearch: state.uiPersist.homestaySearch,
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
export default class BookNow extends Component {

  state = {
    immersionsAvailable: {
      stay: false,
      tandem: false,
      teacher: false,
    },
    immersionForPriceCalculation: null,
  }

  componentWillMount = () => {

    const { homestay, homestaySearch } = this.props

    let selectedImmersion = null

    const immersionsAvailable = {
      stay: homestay.data.immersions.stay && homestay.data.immersions.stay.isActive,
      tandem: homestay.data.immersions.tandem && homestay.data.immersions.tandem.isActive,
      teacher: homestay.data.immersions.teacher && homestay.data.immersions.teacher.isActive,
    }

    if (homestaySearch.params.immersions.stay && immersionsAvailable.stay) {
      selectedImmersion = 'stay'
    } else if (homestaySearch.params.immersions.tandem && immersionsAvailable.tandem) {
      selectedImmersion = 'tandem'
    } else if (homestaySearch.params.immersions.teacher && immersionsAvailable.teacher) {
      selectedImmersion = 'teacher'
    }
    this.setState({
      immersionsAvailable,
      immersionForPriceCalculation: selectedImmersion,
    })
  }

  handleBookNowClick = () => {

    const { immersionForPriceCalculation } = this.state
    const { auth, dispatch, homestay, homestaySearch, uiCurrency } = this.props

    if (auth.loaded && auth.jwt) {

      // ------------------------------------------------------------------------------------
      // Create potential booking object and redirect into homestay booking flow
      // First object is an actual booking object which will eventually be used in a POST
      // Second object is a helper object
      // ------------------------------------------------------------------------------------
      dispatch(createPotentialHomestayBooking({
        arrivalDate: homestaySearch.params.arrival,
        departureDate: homestaySearch.params.departure,
        guestCount: homestaySearch.params.guests,
        roomId: homestaySearch.activeRoom,
        stayId: homestay.data.immersions[immersionForPriceCalculation].id,
        languageHostWillTeach: homestaySearch.params.language || homestay.data.stayAvailableLanguages[0],
        languageGuestWillTeach: immersionForPriceCalculation === 'tandem' ? homestay.data.immersions.tandem.languagesInterested[0].lang : null,
        currency: uiCurrency,
        serviceNames: [],
        settingNames: [],
        paymentMethodId: null,
      }, {
        completionStep: 1,
        homeId: homestay.data.id,
        homeLat: homestay.data.location.lat,
        homeLng: homestay.data.location.lng,
        immersionType: immersionForPriceCalculation,
      }))
      dispatch(push('/book-homestay'))

    } else {

      // If the user is not logged in, open the login modal
      dispatch(openLoginModal())

    }

  }

  handleDatesChange = value => {

    const { dispatch, homestaySearch } = this.props

    // The dates input returns both dates at once
    const newParams = Object.assign({}, homestaySearch.params, {
      arrival: value.startDate ? apiDate(value.startDate) : null,
      departure: value.endDate ? apiDate(value.endDate) : null,
    })

    dispatch(updateRoomSearchParams(newParams))

  }

  handleImmersionChange = immersion => {
    const { dispatch, homestaySearch } = this.props
    const newParams = Object.assign({}, homestaySearch.params, {
      immersions: {
        stay: immersion.value === 'stay' ? true : homestaySearch.params.immersions.stay,
        tandem: immersion.value === 'tandem' ? true : homestaySearch.params.immersions.tandem,
        teacher: immersion.value === 'teacher' ? true : homestaySearch.params.immersions.teacher,
      },
    })
    this.setState({ immersionForPriceCalculation: immersion.value }, () => {
      dispatch(updateRoomSearchParams(newParams))
    })
  }

  handleRoomChange = roomID => {

    // Clear memoized cache
    this.determineBlockedStatus.clear()

    const { dispatch, handleRoomDropdownChange } = this.props

    dispatch(updateActiveRoom(roomID))
    handleRoomDropdownChange(false)
  }

  determineBlockedStatus = moize(day => {

    return this.props.homestay.roomCalendars[this.props.homestaySearch.activeRoom].data.unavailabilities.some(blockedRange => {

      return moment.range(moment(blockedRange.start), moment(blockedRange.end)).contains(day)

    })

  })

  render() {

    const { immersionsAvailable, immersionForPriceCalculation } = this.state

    const {
      auth,
      currencySymbol,
      handleRoomDropdownChange,
      homestay,
      homestaySearch,
      immersionRates,
      t,
      roomSelectionOpen,
    } = this.props

    const hasDateRange = homestaySearch.params.arrival && homestaySearch.params.departure
    const determineBlockedStatus = homestay.roomCalendars[homestaySearch.activeRoom] && homestay.roomCalendars[homestaySearch.activeRoom].data && homestay.roomCalendars[homestaySearch.activeRoom].data.unavailabilities ? this.determineBlockedStatus : () => false

    const alphabeticalRooms = homestay.data.rooms.sort((a, b) => {
      const x = a.name.toLowerCase()
      const y = b.name.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0 // eslint-disable-line
    })

    const weeklyPriceBasedOnSelectedImmersion = immersionRates[`${immersionForPriceCalculation}Rate`]

    return (
      <SpinLoader show={homestay.roomCalendars.loading}>
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
            <Col xs={12} style={styles.alignLeft} onClick={() => handleRoomDropdownChange(true)}>
              <Select
                theme='bootstrap3'
                className='book-now-room-select'
                value={homestay.data.rooms.filter(room => room.id === homestaySearch.activeRoom)[0] ? { value: homestaySearch.activeRoom, label: homestay.data.rooms.filter(room => room.id === homestaySearch.activeRoom)[0].name } : {}}
                onValueChange={event => this.handleRoomChange(event ? event.value : null)}
                open={roomSelectionOpen}
                onBlur={() => handleRoomDropdownChange(false)}
                onFocus={() => handleRoomDropdownChange(true)}
              >
                {alphabeticalRooms.map(room => <option key={`room-${room.id}-${room.name}`} value={room.id}>{room.name}</option>)}
              </Select>
            </Col>
            <Col xs={12} style={styles.alignLeft}>
              <Select
                theme='bootstrap3'
                className='book-now-room-select'
                onValueChange={this.handleImmersionChange}
                value={typeof immersionForPriceCalculation === 'string' ? { value: immersionForPriceCalculation, label: t(`homes.${immersionForPriceCalculation}_immersion`) } : null}
              >
                {Object.keys(immersionsAvailable).filter(immersion => immersionsAvailable[immersion]).map(immersion => {
                  return (
                    <option key={`book-now-immersion-${immersion}`} value={immersion}>{t(`homes.${immersion}_immersion`)}</option>
                  )
                })}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col xs={12} style={Object.assign({}, styles.alignLeft, { paddingBottom: 10 })}>
              <strong className='header-green'>{t('common.Price')}:</strong>

              <span className='pull-right'>
                {hasDateRange && !auth.loaded &&
                  <a onClick={() => this.props.dispatch(openLoginModal())}>{t('common.log_in_to_see_prices')}</a>
                }
                {(!homestaySearch.params.arrival || !homestaySearch.params.departure) &&
                  <span>{currencySymbol}{weeklyPriceBasedOnSelectedImmersion}/{t('common.week')}</span>
                }
                {hasDateRange && auth.loaded && homestaySearch.activeRoom && immersionForPriceCalculation &&
                  <HomestayPriceCalculator
                    homeID={this.props.homeID}
                    immersionForPriceCalculation={immersionForPriceCalculation}
                  />
                }
              </span>

            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {!hasDateRange ?
                <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip'>{t('homes.pick_dates_tooltip')}</Tooltip>}>
                  <Button
                    className='disabled'
                    style={styles.bookNowButton}
                    block
                    bsStyle='success'
                    bsSize='large'
                  >
                    {t('common.Book_now')}
                  </Button>
                </OverlayTrigger>
                :
                <Button
                  onClick={this.handleBookNowClick}
                  style={styles.bookNowButton}
                  block
                  bsStyle='success'
                  bsSize='large'
                >
                  {t('common.Book_now')}
                </Button>
              }


            </Col>
          </Row>
        </span>
      </SpinLoader>
    )
  }
}

BookNow.propTypes = {
  auth: PropTypes.object,
  currencySymbol: PropTypes.string,
  dispatch: PropTypes.func,
  handleRoomDropdownChange: PropTypes.func,
  homeID: PropTypes.number,
  homestay: PropTypes.object,
  homestaySearch: PropTypes.object,
  immersionRates: PropTypes.object,
  roomSelectionOpen: PropTypes.bool,
  uiCurrency: PropTypes.string,
  t: PropTypes.func,
}
