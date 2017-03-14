// Absolute imports
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { BackgroundImage } from 'components'
import { Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { courseResultMouseEnter, courseResultMouseLeave } from 'redux/modules/ui/search/hoverables'
import Currencies from 'data/constants/Currencies'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { updateActiveCourse } from 'redux/modules/ui/search/courseSearch'
import Radium from 'radium'
import Rate from 'antd/lib/rate'
import { semanticDate } from 'utils/dates'
import TextTruncate from 'react-text-truncate'

// Relative imports
import styles from '../SearchCourses.styles'

@connect()
@translate()
@Radium
export default class Result extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  handleClick = () => this.props.dispatch(updateActiveCourse(this.props.result.courseId))

  handleMouseEnter = () => {
    const { dispatch, result } = this.props
    dispatch(courseResultMouseEnter(result.courseId))
  }

  handleMouseLeave = () => {
    const { dispatch, result } = this.props
    dispatch(courseResultMouseLeave(result.courseId))
  }

  render() {

    const { currency, t, result, startLevel } = this.props
    const currencySymbol = Currencies[currency]

    return (
      <div
        key={result.courseId}
        style={styles.searchResult}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Link onClick={this.handleClick} to={`/language-school/${result.educatorId}`} style={styles.overlayLink} />
        <div style={styles.searchResultPrice}>{currencySymbol}{(result.totalPrice).toFixed(2)}</div>
        <Col xs={12} md={5} style={styles.resultCol}>
          <BackgroundImage
            maxWidth={300}
            src={result.educatorImage ? result.educatorImage : '/app/courses/default_course.jpg'}
            styles={styles.searchResultImg}
          />
        </Col>

        <Col xs={12} md={7} style={styles.resultCol}>
          <div style={styles.searchResultText}>
            <div style={styles.searchResultTitle}>
              {result.courseName}
            </div>
            <div style={styles.searchResultSubtitle} className='text-muted'>
              {result.educatorName}
            </div>
            <div style={styles.resultDescription}>
              <TextTruncate
                ref={node => this.truncator = node}
                line={3}
                text={result.shortDescription}
              />
            </div>
            <div style={styles.resultDates}>
              {semanticDate(t, result.startDate)} {t('common.words.to')} {semanticDate(t, result.endDate)}
            </div>
            <div style={styles.resultLevel}>
              <div className='course-info-tag'>{startLevel} {t('common.words.to')} {result.endLevel}</div>
              <div className='course-info-tag'>{currencySymbol}{(result.weeklyPrice).toFixed(2)}{t('search.per_week')}}</div>
            </div>
          </div>

          <div style={styles.searchResultRating} className='small-rating-wrapper'>
            ({result.educatorReviewResponses.length}) <Rate disabled defaultValue={result.educatorAverageRating} />
          </div>

        </Col>


      </div>
    )
  }
}

Result.propTypes = {
  currency: PropTypes.string,
  dispatch: PropTypes.func,
  t: PropTypes.func,
  result: PropTypes.object,
  roomHovered: PropTypes.number,
  startLevel: PropTypes.string,
}
