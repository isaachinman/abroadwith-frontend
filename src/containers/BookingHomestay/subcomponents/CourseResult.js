// Absolute imports
import React, { Component, PropTypes } from 'react'
import { addUpsellCourseBooking, removeUpsellCourseBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import { Button, Col, Collapse, Tab, Tabs, Table, Row } from 'react-bootstrap'
import config from 'config'
import { connect } from 'react-redux'
import { formatTimeOfDay } from 'utils/times'
import Rate from 'antd/lib/rate'
import roundTo from 'round-to'
import { sortByDayOfWeek } from 'utils/dates'
import { translate } from 'react-i18next'
import TextTruncate from 'react-text-truncate'

// Relative imports
const styles = {
  result: {
    border: '1px solid #ddd',
    borderRadius: 5,
    overflow: 'hidden',
    background: 'rgba(255,255,255,.65)',
    transition: 'opacity .2s',
  },
  educatorImage: {
    width: '100%',
    minHeight: 178, // Account for border top and bottom of 1px each
    backgroundSize: 'cover',
  },
  imageCol: {
    paddingLeft: 0,
    transition: 'width .35s',
  },
  widthTransition: {
    transition: 'width .35s',
  },
  resultDetails: {
    padding: '15px 0',
  },
  ratingNumber: {
    fontSize: 11,
  },
  rightAlign: {
    textAlign: 'right',
  },
  truncatedDescription: {
    minHeight: 44,
  },
  fullInfoLink: {
    marginTop: 5,
  },
  moreInfoTabs: {
    marginTop: 15,
  },
  courseTabContent: {
    padding: '15px 0',
  },
  bottomRow: {
    marginTop: 23,
  },
  omittedResult: {
    pointerEvents: 'none',
    opacity: 0.35,
  },
}

@connect(
  state => ({
    potentialBookingHelpers: state.bookings.homestayBookings.potentialBookingHelpers,
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
export default class CourseResult extends Component {

  state = {
    expanded: false,
    localAnimationInProgress: false,
  }

  componentWillUpdate = nextProps => {

    // Have to call truncate on animation complete because text might have previously been hidden
    if (this.props.animationInProgress !== nextProps.animationInProgress) {
      this.truncator.onResize()
    }

    // If a result is chosen and additional info is expanded, close it
    if (nextProps.potentialBookingHelpers.upsellCourseBooking.courseId && this.state.expanded) {
      this.setState({ expanded: false })
    }

  }

  addCourse = () => this.props.dispatch(addUpsellCourseBooking(Object.assign({}, this.props.result, {
    totalPrice: roundTo(this.props.result.totalPrice, 2),
    weeklyPrice: roundTo(this.props.result.weeklyPrice, 2),
  })))

  removeCourse = () => this.props.dispatch(removeUpsellCourseBooking())

  toggleExpanded = () => {
    this.setState({ localAnimationInProgress: true, expanded: !this.state.expanded })
    setTimeout(() => this.setState({ localAnimationInProgress: false }), 350)
  }

  render() {

    const { expanded, localAnimationInProgress } = this.state
    const { result, potentialBookingHelpers, t } = this.props

    const aResultIsAdded = potentialBookingHelpers.upsellCourseBooking.courseId
    const isAddedToBooking = aResultIsAdded && potentialBookingHelpers.upsellCourseBooking.courseId === result.courseId

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
        <Col xs={12} md={4} style={expanded ? Object.assign({}, styles.imageCol, { width: 0, height: 0 }) : styles.imageCol}>
          <div style={Object.assign({}, styles.educatorImage, { backgroundImage: `url(${config.img}${result.educatorImage || '/app/courses/default_course.jpg'})` })} />
        </Col>
        <Col xs={12} md={expanded ? 12 : 8} style={styles.widthTransition}>
          <div style={styles.resultDetails}>
            <Row>
              <Col xs={12} sm={8}>
                <h5>{result.courseName}</h5>
              </Col>
              <Col xs={12} sm={4} style={styles.rightAlign} className='small-rating-wrapper light'>
                <div style={{ marginTop: 10 }}>
                  <span style={styles.ratingNumber} className='text-muted'>({result.educatorReviewResponses.length})</span> <Rate disabled defaultValue={roundTo((result.educatorAverageRating || 0), 0)} />
                </div>
              </Col>
              <Col xs={12} sm={11}>
                {expanded ?
                  <div>
                    {result.shortDescription}
                  </div>
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
                          {sortByDayOfWeek(result.timeSlots).map(timeslot => {
                            return (
                              <tr key={`timeslot-${timeslot.dayOfWeek}-${timeslot.startTime}`}>
                                <td>{t(`booking.weekdays.${timeslot.dayOfWeek}`)}</td>
                                <td>{formatTimeOfDay(timeslot.startTime)} - {formatTimeOfDay(timeslot.endTime)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </Tab>
                    <Tab eventKey={2} title={t('booking.reviews')} style={styles.courseTabContent}>
                      Reviews
                    </Tab>
                    <Tab eventKey={3} title={t('booking.school_closures')} style={styles.courseTabContent}>
                      School closures
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

CourseResult.propTypes = {
  animationInProgress: PropTypes.bool,
  currencySymbol: PropTypes.string,
  dispatch: PropTypes.func,
  result: PropTypes.object,
  potentialBookingHelpers: PropTypes.object,
  t: PropTypes.func,
}
