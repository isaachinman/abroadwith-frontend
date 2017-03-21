// Absolute imports
import React, { Component, PropTypes } from 'react'
import { apiDate } from 'utils/dates'
import { Button, Col, OverlayTrigger, Tooltip, Row } from 'react-bootstrap'
// import { createPotentialHomestayBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import { connect } from 'react-redux'
import { DateRangePicker, SpinLoader } from 'components'
import moment from 'moment'
// import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
// import { openLoginModal, openVerifyEmailModal } from 'redux/modules/ui/modals'
// import { push } from 'react-router-redux'
import { SimpleSelect as Select } from 'react-selectize'
import { translate } from 'react-i18next'
import { updateCourseSearchParams, updateActiveCourse } from 'redux/modules/ui/search/courseSearch'

// Relative imports
import CoursePriceCalculator from './CoursePriceCalculator'
import styles from '../School.styles'

// Language level ranking
const levelMap = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
}

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

    // const { immersionForPriceCalculation } = this.state
    // const { auth, dispatch, homestay, courseSearch, uiCurrency, user, token } = this.props
    //
    // if (auth.jwt && auth.jwt && user.data) {
    //
    //   const processRequest = () => {
    //     // ------------------------------------------------------------------------------------
    //     // Create potential booking object and redirect into homestay booking flow
    //     // First object is an actual booking object which will eventually be used in a POST
    //     // Second object is a helper object
    //     // ------------------------------------------------------------------------------------
    //     const serviceNames = courseSearch.params.filters.filter(filter => HomeData.homeServices.MEAL_PLAN.includes(filter) || HomeData.homeServices.GENERAL.includes(filter))
    //     const settingNames = courseSearch.params.filters.filter(filter => HomeData.homeServices.FOOD_OPTION.includes(filter))
    //     dispatch(createPotentialHomestayBooking({
    //       arrivalDate: courseSearch.params.arrival,
    //       departureDate: courseSearch.params.departure,
    //       guestCount: courseSearch.params.guests,
    //       courseID: courseSearch.activeRoom,
    //       stayId: homestay.data.immersions[immersionForPriceCalculation].id,
    //       languageHostWillTeach: courseSearch.params.language && homestay.data.immersions[immersionForPriceCalculation].languagesOffered.indexOf(courseSearch.params.language) > -1 ? courseSearch.params.language : homestay.data.immersions[immersionForPriceCalculation].languagesOffered[0],
    //       languageGuestWillTeach: immersionForPriceCalculation === 'tandem' ? homestay.data.immersions.tandem.languagesInterested[0].lang : null,
    //       currency: uiCurrency,
    //       serviceNames,
    //       settingNames,
    //       paymentMethodId: null,
    //       weeklyHours: immersionForPriceCalculation === 'teacher' ? homestay.data.immersions.teacher.packages[0] : null,
    //     }, {
    //       createdAt: new Date(),
    //       completionStep: 1,
    //       educatorID: homestay.data.id,
    //       homeLat: homestay.data.location.lat,
    //       homeLng: homestay.data.location.lng,
    //       immersionType: immersionForPriceCalculation,
    //     }))
    //     dispatch(push('/book-homestay'))
    //   }
    //
    //   // Users must have email verifications
    //   if (!user.data.verifications.email) {
    //
    //     dispatch(loadUserWithAuth(token, response => {
    //
    //       if (response && response.verifications && response.verifications.email) {
    //         processRequest()
    //       } else {
    //         dispatch(openVerifyEmailModal())
    //       }
    //
    //     }))
    //
    //   } else if (user.data.verifications.email) {
    //
    //     processRequest()
    //
    //   }
    //
    // } else {
    //
    //   // If the user is not logged in, open the login modal
    //   dispatch(openLoginModal(() => dispatch(push('/book-homestay'))))
    //
    // }

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

  handleChangeLanguageLevel = level => {

    console.log(level)

    const { courseSearch, dispatch } = this.props
    const newParams = Object.assign({}, courseSearch.params, { level: level.value })

    // TODO: if activeCourse is not null, need to make sure activeCourse supports new level

    dispatch(updateCourseSearchParams(newParams))

  }

  handleCourseChange = newCourse => {

    console.log(newCourse)

    const { dispatch } = this.props
    dispatch(updateActiveCourse(newCourse.value))

    // TODO: check against language level, set language level if needed

  }

  determineLanguageLevels = () => {

    const levels = {
      low: 6,
      high: 0,
    }

    this.props.courses.map(course => {
      if (levelMap[course.startLevel] < levels.low) {
        levels.low = course.startLevel
      }
      if (levelMap[course.endLevel] > levels.high) {
        levels.high = course.endLevel
      }
    })

    return levels

  }

  render() {

    const { courses, courseSearch, t } = this.props

    const { activeCourse } = courseSearch
    const hasDateRange = courseSearch.params.arrival && courseSearch.params.departure

    const alphabeticalCourses = courses ? courses.sort((a, b) => {
      const x = a.name.toLowerCase()
      const y = b.name.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0 // eslint-disable-line
    }) : []

    // If language levels have not been calculated, calculate and store them
    if (!this.startLevel || !this.endLevel) {
      const levels = this.determineLanguageLevels()
      this.startLevel = levels.low
      this.endLevel = levels.high
    }

    console.log(this)

    return (
      <SpinLoader show={false}>
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
          <Row style={styles.bookNowBorderBottom}>
            <Col xs={12} style={styles.alignLeft}>
              <Select
                theme='bootstrap3'
                className='book-now-room-select'
                value={{ value: courseSearch.params.level, label: courseSearch.params.level }}
                onValueChange={this.handleChangeLanguageLevel}
              >
                {Object.keys(levelMap).map(level => {
                  if (levelMap[level] >= levelMap[this.startLevel] && levelMap[level] <= levelMap[this.endLevel]) {
                    return <option value={level} key={level}>{(level).toString()}</option>
                  }
                })}
              </Select>
            </Col>
            <Col xs={12} style={styles.alignLeft}>
              <Select
                placeholder='Course'
                theme='bootstrap3'
                className='book-now-room-select'
                value={activeCourse ? { value: activeCourse, label: courses.filter(course => course.id === activeCourse)[0].name } : {}}
                onValueChange={this.handleCourseChange}
              >
                {alphabeticalCourses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <CoursePriceCalculator />
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
  courses: PropTypes.array,
  currencySymbol: PropTypes.string,
  dispatch: PropTypes.func,
  educatorID: PropTypes.number,
  courseSearch: PropTypes.object,
  uiCurrency: PropTypes.string,
  user: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
