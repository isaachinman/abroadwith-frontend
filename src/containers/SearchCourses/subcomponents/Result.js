// Absolute imports
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { BackgroundImage } from 'components'
import { connect } from 'react-redux'
import { Carousel } from 'react-bootstrap'
import { courseResultMouseEnter, courseResultMouseLeave } from 'redux/modules/ui/search/hoverables'
import Currencies from 'data/constants/Currencies'
import config from 'config'
import FontAwesome from 'react-fontawesome'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { updateActiveCourse } from 'redux/modules/ui/search/courseSearch'
import parsePhotoOrder from 'utils/homes/parsePhotoOrder'
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

    const parsedPhotoArray = result.homePhotosWithOrder && result.homePhotosWithOrder.length > 0 ? parsePhotoOrder(result.homePhotosWithOrder) : []

    return (
      <div
        key={result.courseId}
        style={styles.searchResult}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className='result-second-child-margin course'
      >
        <Link onClick={this.handleClick} to={`/language-school/${result.educatorId}`} style={styles.overlayLink} />
        <div style={styles.searchResultPrice}>{Currencies[currency]}{Math.ceil(result.price)}<span style={styles.perWeek}>{t('search.per_week')}</span></div>
        <Carousel
          indicators={false}
          interval={0}
          slide={false}
          style={styles.searchResultCarousel}
          prevIcon={<FontAwesome style={styles.carouselIcon} name='angle-left' />}
          nextIcon={<FontAwesome style={styles.carouselIcon} name='angle-right' />}
        >
          {result.roomPhoto &&
            <Carousel.Item>
              <BackgroundImage
                maxWidth={300}
                src={result.roomPhoto}
                styles={styles.searchResultCarouselImg}
              />
            </Carousel.Item>
          }
          {parsedPhotoArray.map(photo => {
            return (
              <Carousel.Item key={photo}>
                {!result.roomPhoto && parsedPhotoArray.indexOf(photo) === 0 ?
                  <BackgroundImage
                    maxWidth={300}
                    src={photo}
                    styles={styles.searchResultCarouselImg}
                  />
                  :
                  <div style={Object.assign({}, styles.searchResultCarouselImg, { backgroundImage: `url(${config.img}${photo}?w=300)` })} />
                }
              </Carousel.Item>
            )
          })}
        </Carousel>
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
