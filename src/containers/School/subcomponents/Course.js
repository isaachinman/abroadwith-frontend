// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Collapse, Table, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { generateRecurrenceEndDate } from 'utils/courses'
import { semanticDate, sortByDayOfWeek } from 'utils/dates'
import { updateActiveCourse } from 'redux/modules/ui/search/courseSearch'
import { translate } from 'react-i18next'
import moment from 'moment'

// Relative imports
import styles from '../School.styles'

// Days of week map
const daysOfTheWeek = {
  0: 'mon',
  1: 'tue',
  2: 'wed',
  3: 'thu',
  4: 'fri',
  5: 'sat',
  6: 'sun',
}

@connect(
  state => ({
    courseSearch: state.uiPersist.courseSearch,
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
export default class Course extends Component {

  state = {
    expanded: false,
  }

  componentWillMount = () => {

    // If the course is non-recurring, calculate the end date
    // This can also be done for individual recurrences if desired
    if (this.props.result.recurrenceType === null) {
      const { result } = this.props
      this.endDate = generateRecurrenceEndDate(result.startDate, result.numberOfWeeks, result.timeSlots)
      console.log('endDate: ', this.endDate)
    }

  }

  addCourse = () => {
    this.props.dispatch(updateActiveCourse(this.props.result.id))
  }

  removeCourse = () => this.props.dispatch(updateActiveCourse(null))

  toggleExpanded = () => {
    this.setState({ localAnimationInProgress: true, expanded: !this.state.expanded })
    setTimeout(() => this.setState({ localAnimationInProgress: false }), 350)
  }

  render() {

    const { expanded } = this.state
    const { result, courseSearch, t, educatorName } = this.props

    const aResultIsAdded = courseSearch.activeCourse
    const isAddedToBooking = aResultIsAdded && courseSearch.activeCourse === result.id

    const sortedTimeslots = sortByDayOfWeek(result.timeSlots)

    let courseDateDescription = null

    const startDayOfWeek = t(`common.weekdays.${daysOfTheWeek[moment(result.startDate).day()]}`)
    const nthOfMonth = Math.ceil(moment(result.startDate).date() / 7)

    console.log(result.startDate, startDayOfWeek, nthOfMonth)

    switch (result.recurrenceType) {
      case null:
        courseDateDescription = t('schools.course_length_descriptors.non_recurring', { startDate: result.startDate, endDate: this.endDate })
        break
      case 'WEEKLY':
        courseDateDescription = t('schools.course_length_descriptors.weekly', { dayOfWeek: startDayOfWeek, weekCount: t(`schools.course_weekcounts.w${nthOfMonth}`) })
        break
      case 'MONTHLY':
        courseDateDescription = t('schools.course_length_descriptors.monthly', { dayOfWeek: startDayOfWeek, weekCount: t(`schools.course_weekcounts.w${nthOfMonth}`) })
        break
      case 'QUARTERLY':
        courseDateDescription = t('schools.course_length_descriptors.quarterly', { dayOfWeek: startDayOfWeek, weekCount: t(`schools.course_weekcounts.w${nthOfMonth}`) })
        break
      case 'HALF_YEARLY':
        courseDateDescription = t('schools.course_length_descriptors.biannual', { dayOfWeek: startDayOfWeek, weekCount: t(`schools.course_weekcounts.w${nthOfMonth}`) })
        break
      default: {
        break
      }
    }

    return (
      <Row style={styles.result}>
        <Col xs={12}>
          <div style={styles.resultDetails}>
            <Row>
              <Col xs={12} sm={8}>
                <h5 style={styles.courseName}>{result.name}</h5>
              </Col>
              <Col xs={12} sm={11}>
                <p>
                  {result.description}
                </p>
                <p>{courseDateDescription}</p>
              </Col>
              <Collapse in={expanded}>
                <Col xs={12}>
                  <p>
                    <strong>{t('booking.result_dates')}: </strong>{semanticDate(t, result.startDate)} {t('common.words.to')} {semanticDate(t, result.endDate)}<br />
                    <strong>{t('booking.educator_name')}: </strong>{educatorName}<br />
                    <strong>{t('booking.level')}: </strong>{courseSearch.params.level}-{result.endLevel}<br />
                    <strong>{t('booking.lessons_per_week')}: </strong>{result.hoursPerWeek}
                  </p>
                  <h6 style={{ marginTop: 30 }}>{t('booking.weekly_schedule')}</h6>
                  <Table striped bordered condensed hover>
                    <thead>
                      <tr>
                        <th>{t('booking.day_of_week')}</th>
                        <th style={{ textTransform: 'capitalize' }}>{t('booking.hours')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTimeslots.map(dayOfWeek => {
                        return (
                          <tr key={`timeslot-${dayOfWeek.day}`}>
                            <td>{t(`booking.weekdays.${dayOfWeek.day}`)}</td>
                            <td>
                              {dayOfWeek.slots.map(timespan => {
                                return (
                                  <span key={`${dayOfWeek}-${timespan.startTime}`}>
                                    {timespan.startTime}-{timespan.endTime}
                                    {dayOfWeek.slots.indexOf(timespan) !== dayOfWeek.slots.length - 1 &&
                                    <span>,&nbsp;</span>
                                      }
                                  </span>
                                )
                              })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </Col>

              </Collapse>
              <Col xs={6} style={styles.bottomRow}>
                <div style={styles.fullInfoLink}>
                  <a onClick={this.toggleExpanded}>{expanded ? <span>{t('common.words.less')}</span> : <span>{t('booking.full_info')}</span> }</a>
                </div>
              </Col>
              {(!aResultIsAdded || (aResultIsAdded && !isAddedToBooking)) &&
                <Col xs={6} style={Object.assign({}, styles.rightAlign, styles.bottomRow)}>
                  <Button onClick={this.addCourse} bsSize='xsmall' bsStyle='success'>{t('booking.add_course')}</Button>
                </Col>
              }
              {isAddedToBooking &&
                <Col xs={6} style={Object.assign({}, styles.rightAlign, styles.bottomRow)}>
                  <h6 style={{ margin: 0 }} className='header-green'>Course selected <FontAwesome name='check-circle' /></h6>
                </Col>
              }
            </Row>
          </div>
        </Col>
      </Row>
    )
  }
}

Course.propTypes = {
  animationInProgress: PropTypes.bool,
  courseSearch: PropTypes.object,
  currencySymbol: PropTypes.string,
  dispatch: PropTypes.func,
  educatorName: PropTypes.string,
  result: PropTypes.object,
  upsellSearch: PropTypes.object,
  potentialBookingHelpers: PropTypes.object,
  t: PropTypes.func,
}
