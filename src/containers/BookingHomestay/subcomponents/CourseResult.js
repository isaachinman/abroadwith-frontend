// Absolute imports
import React, { Component, PropTypes } from 'react'
import { addUpsellCourseBooking, removeUpsellCourseBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import { Button, Col, Row } from 'react-bootstrap'
import config from 'config'
import { connect } from 'react-redux'
import Rate from 'antd/lib/rate'
import roundTo from 'round-to'
import { translate } from 'react-i18next'
import TextTruncate from 'react-text-truncate'

// Relative imports
const styles = {
  result: {
    border: '1px solid #ddd',
    borderRadius: 5,
    overflow: 'hidden',
    background: 'rgba(255,255,255,.65)',
  },
  educatorImage: {
    marginLeft: -15,
    width: 'calc(100% + 15px)',
    minHeight: 178, // Account for border top and bottom of 1px each
    backgroundSize: 'cover',
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
  fullInfoLink: {
    marginTop: 5,
  },
  bottomRow: {
    marginTop: 25,
  },
}

@connect(
  state => ({
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
export default class UpsellCourseSearch extends Component {

  state = {
    expanded: false,
  }

  componentWillUpdate = nextProps => {
    if (this.props.animationInProgress !== nextProps.animationInProgress) {
      this.truncator.onResize()
    }
  }

  addCourse = () => this.props.dispatch(addUpsellCourseBooking(this.props.result))
  removeCourse = () => this.props.dispatch(removeUpsellCourseBooking())

  toggleExpanded = () => this.setState({ expanded: !this.state.expanded })

  render() {

    const { result, t } = this.props

    return (
      <Row style={styles.result}>
        <Col xs={12} md={4}>
          <div style={Object.assign({}, styles.educatorImage, { backgroundImage: `url(${config.img}${result.educatorImage || '/app/courses/default_course.jpg'})` })} />
        </Col>
        <Col xs={12} md={8}>
          <div style={styles.resultDetails}>
            <Row>
              <Col xs={12} sm={8}>
                <h5>{result.courseName}</h5>
              </Col>
              <Col xs={12} sm={4} style={styles.rightAlign} className='small-rating-wrapper light'>
                <div style={{ marginTop: 10 }}>
                  <span style={styles.ratingNumber} className='text-muted'>({result.educatorReviewResponses.length})</span> <Rate disabled defaultValue={roundTo(result.educatorAverageRating, 0)} />
                </div>
              </Col>
              <Col xs={12} sm={11}>
                <TextTruncate
                  ref={node => this.truncator = node}
                  line={2}
                  text={result.shortDescription}
                />
              </Col>
              <Col xs={6} style={styles.bottomRow}>
                <div style={styles.fullInfoLink}>
                  <a onClick={this.toggleExpanded}>{t('booking.full_info')}</a>
                </div>
              </Col>
              <Col xs={6} style={Object.assign({}, styles.rightAlign, styles.bottomRow)}>
                <Button onClick={this.addCourse} bsSize='xsmall' bsStyle='success'>{t('booking.add_course')}</Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    )
  }
}

UpsellCourseSearch.propTypes = {
  animationInProgress: PropTypes.bool,
  currencySymbol: PropTypes.string,
  dispatch: PropTypes.func,
  result: PropTypes.object,
  t: PropTypes.func,
}
