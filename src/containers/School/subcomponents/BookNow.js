// Absolute imports
import React, { Component, PropTypes } from 'react'
import { apiDate } from 'utils/dates'
import { Button, Col, OverlayTrigger, Tooltip, Row } from 'react-bootstrap'
import { createPotentialHomestayBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import { connect } from 'react-redux'
import { DateRangePicker, SpinLoader } from 'components'
import HomeData from 'data/constants/HomeData'
import moment from 'moment'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
import { openLoginModal, openVerifyEmailModal } from 'redux/modules/ui/modals'
import { push } from 'react-router-redux'
// import { SimpleSelect as Select } from 'react-selectize'
import { translate } from 'react-i18next'
import { updateCourseSearchParams, updateActiveCourse } from 'redux/modules/ui/search/courseSearch'

// Relative imports
// import HomestayPriceCalculator from './HomestayPriceCalculator'
import styles from '../School.styles'

// Extend moment

@connect(
  (state, ownProps) => ({
    auth: state.auth,
    educator: state.publicData.educators[ownProps.educatorID],
    courseSearch: state.uiPersist.courseSearch,
    uiCurrency: state.ui.currency.value,
    user: state.privateData.user,
    token: state.auth.token,
  })
)
@translate()
export default class BookNow extends Component {

  handleBookNowClick = () => {

    const { immersionForPriceCalculation } = this.state
    const { auth, dispatch, homestay, courseSearch, uiCurrency, user, token } = this.props

    if (auth.jwt && auth.jwt && user.data) {

      const processRequest = () => {
        // ------------------------------------------------------------------------------------
        // Create potential booking object and redirect into homestay booking flow
        // First object is an actual booking object which will eventually be used in a POST
        // Second object is a helper object
        // ------------------------------------------------------------------------------------
        const serviceNames = courseSearch.params.filters.filter(filter => HomeData.homeServices.MEAL_PLAN.includes(filter) || HomeData.homeServices.GENERAL.includes(filter))
        const settingNames = courseSearch.params.filters.filter(filter => HomeData.homeServices.FOOD_OPTION.includes(filter))
        dispatch(createPotentialHomestayBooking({
          arrivalDate: courseSearch.params.arrival,
          departureDate: courseSearch.params.departure,
          guestCount: courseSearch.params.guests,
          courseID: courseSearch.activeRoom,
          stayId: homestay.data.immersions[immersionForPriceCalculation].id,
          languageHostWillTeach: courseSearch.params.language && homestay.data.immersions[immersionForPriceCalculation].languagesOffered.indexOf(courseSearch.params.language) > -1 ? courseSearch.params.language : homestay.data.immersions[immersionForPriceCalculation].languagesOffered[0],
          languageGuestWillTeach: immersionForPriceCalculation === 'tandem' ? homestay.data.immersions.tandem.languagesInterested[0].lang : null,
          currency: uiCurrency,
          serviceNames,
          settingNames,
          paymentMethodId: null,
          weeklyHours: immersionForPriceCalculation === 'teacher' ? homestay.data.immersions.teacher.packages[0] : null,
        }, {
          createdAt: new Date(),
          completionStep: 1,
          educatorID: homestay.data.id,
          homeLat: homestay.data.location.lat,
          homeLng: homestay.data.location.lng,
          immersionType: immersionForPriceCalculation,
        }))
        dispatch(push('/book-homestay'))
      }

      // Users must have email verifications
      if (!user.data.verifications.email) {

        dispatch(loadUserWithAuth(token, response => {

          if (response && response.verifications && response.verifications.email) {
            processRequest()
          } else {
            dispatch(openVerifyEmailModal())
          }

        }))

      } else if (user.data.verifications.email) {

        processRequest()

      }

    } else {

      // If the user is not logged in, open the login modal
      dispatch(openLoginModal(() => dispatch(push('/book-homestay'))))

    }

  }

  handleDatesChange = value => {

    const { dispatch, courseSearch } = this.props

    // The dates input returns both dates at once
    const newParams = Object.assign({}, courseSearch.params, {
      arrival: value.startDate ? apiDate(value.startDate) : null,
      departure: value.endDate ? apiDate(value.endDate) : null,
    })

    dispatch(updateCourseSearchParams(newParams))

  }

  handleCourseChange = courseID => {

    const { dispatch } = this.props
    dispatch(updateActiveCourse(courseID))
  }

  render() {

    const {
      currencySymbol,
      handleRoomDropdownChange,
      courses,
      courseSearch,
      immersionRates,
      t,
      roomSelectionOpen,
    } = this.props

    const hasDateRange = courseSearch.params.arrival && courseSearch.params.departure

    // const alphabeticalCourses = courses.loaded ? courses.data.sort((a, b) => {
    //   const x = a.courseName.toLowerCase()
    //   const y = b.courseName.toLowerCase()
    //   return x < y ? -1 : x > y ? 1 : 0 // eslint-disable-line
    // }) : []

    return (
      <SpinLoader show={courses.loading}>
        <span style={styles.bookNowContainer} className='book-now-panel'>
          <Row style={styles.bookNowBorderBottom}>
            <Col xs={12}>
              <DateRangePicker
                startDate={courseSearch.params.arrival ? moment(courseSearch.params.arrival) : null}
                endDate={courseSearch.params.departure ? moment(courseSearch.params.departure) : null}
                inlineBlock
                large
                startDatePlaceholderText={t('common.Arrival')}
                endDatePlaceholderText={t('common.Departure')}
                scrollToPosition={false}
                onDatesChange={this.handleDatesChange}
              />
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
  educatorID: PropTypes.number,
  homestay: PropTypes.object,
  courseSearch: PropTypes.object,
  immersionRates: PropTypes.object,
  roomSelectionOpen: PropTypes.bool,
  uiCurrency: PropTypes.string,
  user: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}


// <SpinLoader show={homestay.roomCalendars.loading}>
//   <span style={styles.bookNowContainer} className='book-now-panel'>
//     <Row style={styles.bookNowBorderBottom}>
//       <Col xs={12}>
//         <DateRangePicker
//           startDate={courseSearch.params.arrival ? moment(courseSearch.params.arrival) : null}
//           endDate={courseSearch.params.departure ? moment(courseSearch.params.departure) : null}
//           inlineBlock
//           large
//           startDatePlaceholderText={t('common.Arrival')}
//           endDatePlaceholderText={t('common.Departure')}
//           isDayBlocked={determineBlockedStatus}
//           scrollToPosition={false}
//           onDatesChange={this.handleDatesChange}
//         />
//       </Col>
//     </Row>
//     <Row style={styles.bookNowBorderBottom}>
//       <Col xs={12} style={styles.alignLeft} onClick={() => handleRoomDropdownChange(true)}>
//         <Select
//           theme='bootstrap3'
//           className='book-now-room-select'
//           value={homestay.data.rooms.filter(room => room.id === courseSearch.activeRoom)[0] ? { value: courseSearch.activeRoom, label: homestay.data.rooms.filter(room => room.id === courseSearch.activeRoom)[0].name } : {}}
//           onValueChange={event => this.handleCourseChange(event ? event.value : null)}
//           open={roomSelectionOpen}
//           onBlur={() => handleRoomDropdownChange(false)}
//           onFocus={() => handleRoomDropdownChange(true)}
//         >
//           {alphabeticalRooms.map(room => <option key={`room-${room.id}-${room.name}`} value={room.id}>{room.name}</option>)}
//         </Select>
//       </Col>
//       <Col xs={12} style={styles.alignLeft}>
//         <Select
//           theme='bootstrap3'
//           className='book-now-room-select'
//           onValueChange={this.handleImmersionChange}
//           value={typeof immersionForPriceCalculation === 'string' ? { value: immersionForPriceCalculation, label: t(`homes.${immersionForPriceCalculation}_immersion`) } : null}
//         >
//           {Object.keys(immersionsAvailable).filter(immersion => immersionsAvailable[immersion]).map(immersion => {
//             return (
//               <option key={`book-now-immersion-${immersion}`} value={immersion}>{t(`homes.${immersion}_immersion`)}</option>
//             )
//           })}
//         </Select>
//       </Col>
//     </Row>
//     <Row>
//       <Col xs={12} style={Object.assign({}, styles.alignLeft, { paddingBottom: 10 })}>
//         <strong className='header-green'>{t('common.Price')}:</strong>
//
//         <span className='pull-right'>
//           {(!courseSearch.params.arrival || !courseSearch.params.departure) &&
//             <span>{currencySymbol}{weeklyPriceBasedOnSelectedImmersion}/{t('common.week')}</span>
//           }
//           {hasDateRange && courseSearch.activeRoom && immersionForPriceCalculation &&
//             <HomestayPriceCalculator
//               educatorID={this.props.educatorID}
//               immersionForPriceCalculation={immersionForPriceCalculation}
//             />
//           }
//         </span>
//
//       </Col>
//     </Row>
//     <Row>
//       <Col xs={12}>
//         {!hasDateRange ?
//           <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip'>{t('homes.pick_dates_tooltip')}</Tooltip>}>
//             <Button
//               className='disabled'
//               style={styles.bookNowButton}
//               block
//               bsStyle='success'
//               bsSize='large'
//             >
//               {t('common.Book_now')}
//             </Button>
//           </OverlayTrigger>
//           :
//           <Button
//             onClick={this.handleBookNowClick}
//             style={styles.bookNowButton}
//             block
//             bsStyle='success'
//             bsSize='large'
//           >
//             {t('common.Book_now')}
//           </Button>
//         }
//       </Col>
//     </Row>
//   </span>
// </SpinLoader>
