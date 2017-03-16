// Absolute imports
import React, { Component, PropTypes } from 'react'
import { addUpsellCourseBooking, removeUpsellCourseBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import { Button, Col, Collapse, Tab, Tabs, Table, Row } from 'react-bootstrap'
import config from 'config'
import { connect } from 'react-redux'
import roundTo from 'round-to'
import { semanticDate, sortByDayOfWeek } from 'utils/dates'
import { translate } from 'react-i18next'
import TextTruncate from 'react-text-truncate'

// Relative imports
import styles from '../School.styles'

@connect(
  state => ({
    courseSearch: state.uiPersist.courseSearch.params,
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
export default class Course extends Component {

  state = {
    expanded: false,
    localAnimationInProgress: false,
  }

  // componentWillUpdate = nextProps => {
  //
  //   // Have to call truncate on animation complete because text might have previously been hidden
  //   if (this.props.animationInProgress !== nextProps.animationInProgress) {
  //     this.truncator.onResize()
  //   }
  //
  //   // If a result is chosen and additional info is expanded, close it
  //   if (nextProps.potentialBookingHelpers.upsellCourseBooking.courseId && nextProps.potentialBookingHelpers.upsellCourseBooking.courseId !== this.props.result.courseId && this.state.expanded) {
  //     this.setState({ expanded: false })
  //   }
  //
  // }

  addCourse = () => {
    const modifiedData = Object.assign({}, this.props.result, {
      totalPrice: roundTo(this.props.result.totalPrice, 2),
      weeklyPrice: roundTo(this.props.result.weeklyPrice, 2),
    })
    delete modifiedData.educatorReviewResponses
    this.props.dispatch(addUpsellCourseBooking(modifiedData))
  }

  removeCourse = () => this.props.dispatch(removeUpsellCourseBooking())

  toggleExpanded = () => {
    this.setState({ localAnimationInProgress: true, expanded: !this.state.expanded })
    setTimeout(() => this.setState({ localAnimationInProgress: false }), 350)
  }

  render() {

    const { expanded, localAnimationInProgress } = this.state
    const { result, courseSearch, t } = this.props

    const aResultIsAdded = courseSearch.activeCourse
    const isAddedToBooking = aResultIsAdded && courseSearch.activeCourse === result.courseId

    const parsedTimeslots = result.courseTimeSlots.map(slot => {
      const split = slot.split(';')
      return {
        dayOfWeek: split[0],
        startTime: split[1],
        endTime: split[2],
      }
    })

    console.log(parsedTimeslots)
    const sortedTimeslots = sortByDayOfWeek(parsedTimeslots)
    console.log('sortedTimeslots: ', sortedTimeslots)

    let resultStyles = styles.result

    if (aResultIsAdded) {
      if (isAddedToBooking) {
        resultStyles = Object.assign({}, styles.result, styles.addedResult)
      } else {
        resultStyles = Object.assign({}, styles.result, styles.omittedResult)
      }
    }

    console.log(this)

    return (
      <Row style={resultStyles}>
        <Col xsHidden smHidden md={4} style={expanded ? Object.assign({}, styles.imageCol, { width: 0, height: 0 }) : styles.imageCol}>
          <div style={Object.assign({}, styles.educatorImage, { backgroundImage: `url(${config.img}${result.educatorImage || '/app/courses/default_course.jpg'})` })} />
        </Col>
        <Col xs={12} md={expanded ? 12 : 8} style={styles.widthTransition}>
          <div style={styles.resultDetails}>
            <Row>
              <Col xs={12} sm={8}>
                <h5 style={styles.courseName}>{result.courseName}</h5>
              </Col>
              <Col xs={12} sm={11}>
                {expanded ?
                  <p>
                    {result.shortDescription}
                  </p>
                  :
                  <div style={styles.truncatedDescription}>
                    <Collapse in={!localAnimationInProgress}>
                      <TextTruncate
                        ref={node => this.truncator = node}
                        line={2}
                        text={result.shortDescription}
                      />
                    </Collapse>
                  </div>
                }
              </Col>
              <Collapse in={expanded}>
                <Col xs={12}>
                  <p>
                    <strong>{t('booking.result_dates')}: </strong>{semanticDate(t, result.startDate)} {t('common.words.to')} {semanticDate(t, result.endDate)}<br />
                    <strong>{t('booking.educator_name')}: </strong>{result.educatorName}<br />
                    <strong>{t('booking.level')}: </strong>{courseSearch.level}-{result.endLevel}<br />
                    <strong>{t('booking.lessons_per_week')}: </strong>{result.lessonsPerWeek}
                  </p>
                  <Tabs style={styles.moreInfoTabs} id={`course-info-tabs-${result.courseId}`}>
                    <Tab eventKey={1} title={t('booking.weekly_schedule')} style={styles.courseTabContent}>
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
                    </Tab>
                  </Tabs>
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
                  <Button onClick={this.removeCourse} bsSize='xsmall' bsStyle='danger'>{t('booking.remove')}</Button>
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
  result: PropTypes.object,
  upsellSearch: PropTypes.object,
  potentialBookingHelpers: PropTypes.object,
  t: PropTypes.func,
}
