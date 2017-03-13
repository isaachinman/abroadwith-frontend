// Absolute imports
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { BackgroundImage } from 'components'
import { connect } from 'react-redux'
import { courseResultMouseEnter, courseResultMouseLeave } from 'redux/modules/ui/search/hoverables'
import Currencies from 'data/constants/Currencies'
import config from 'config'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { updateActiveCourse } from 'redux/modules/ui/search/courseSearch'
import Radium from 'radium'
import Rate from 'antd/lib/rate'

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

    const { currency, t, result } = this.props

    let averageRating = null

    if (result.reviewCount > 0) {
      averageRating = (result.avgCleanRating + result.avgFoodRating + result.avgLangCultLearRating + result.avgLocationRating + result.avgRoomRating) / 5
    }

    return (
      <div
        key={result.courseId}
        style={styles.searchResult}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className='result-second-child-margin course'
      >
        <Link onClick={this.handleClick} to={`/language-school/${result.educatorId}`} style={styles.overlayLink} />
        <div style={styles.searchResultPrice}>{Currencies[currency]}{(result.totalPrice).toFixed(2)}</div>
        <BackgroundImage
          maxWidth={300}
          src={result.educatorImage ? result.educatorImage : '/app/courses/default_course.jpg'}
          styles={styles.searchResultCarouselImg}
        />
        <div style={styles.searchResultBottomHalf} className='bottom-half'>
          <div style={styles.searchResultInfo}>
            <div style={styles.searchResultText}>
              <div style={styles.searchResultTitle}>
                {t('common.home_of', { first_name: result.hostName })}
              </div>
              <div style={styles.searchResultSubtitle}>
                {t(`homes.home_types.${result.homeType}`)} > {result.homeCity} {result.homeNeighbourhood && <span>({result.homeNeighbourhood})</span>}
              </div>
            </div>

            {result.hostPhoto &&
              <div>
                <div style={styles.searchResultHostImgBGMask} />
                <div style={Object.assign({}, styles.searchResultHostImg, { backgroundImage: `url(${config.img}${result.hostPhoto})` })} />
              </div>
            }

            {result.reviewCount > 0 &&
              <div style={styles.searchResultRating} className='small-rating-wrapper'>
                ({result.reviewCount}) <Rate disabled defaultValue={averageRating} />
              </div>
            }

          </div>
          <div className='hover-stripe' />
        </div>
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
}
