// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Carousel } from 'react-bootstrap'
import { roomResultMouseEnter, roomResultMouseLeave } from 'redux/modules/hoverables'
import Currencies from 'data/constants/Currencies'
import config from 'config'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import parsePhotoOrder from 'utils/homes/parsePhotoOrder'
import Radium from 'radium'
import shortid from 'shortid'

// Relative imports
import styles from '../SearchHomestays.styles'

@connect(
  state => ({
    roomHovered: state.hoverables.roomHovered,
  })
)
@translate()
@Radium
export default class Result extends Component {

  shouldComponentUpdate = nextProps => {
    return (this.props.result.roomId === nextProps.roomHovered || (this.props.result.roomId === this.props.roomHovered && this.props.result.roomId !== nextProps.roomHovered))
  }

  handleMouseEnter = () => {
    const { dispatch, result } = this.props
    dispatch(roomResultMouseEnter(result.roomId))
  }

  handleMouseLeave = () => {
    const { dispatch, result } = this.props
    dispatch(roomResultMouseLeave(result.roomId))
  }

  render() {

    const { currency, t, result, roomHovered } = this.props

    return (
      <div
        key={result.roomId}
        style={result.roomId === roomHovered ? styles.searchResultHovered : styles.searchResult}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className='result-second-child-margin'
      >
        <Link to={`/homestay/${result.homeId}`} style={styles.overlayLink} />
        <div style={styles.searchResultPrice}>{Currencies[currency]}{Math.ceil(result.price)}<span style={styles.perWeek}>{t('search.per_week')}</span></div>
        <Carousel
          indicators={false}
          interval={0}
          style={styles.searchResultCarousel}
        >
          {result.roomPhoto &&
          <Carousel.Item>
            <div style={Object.assign({}, styles.searchResultCarouselImg, { backgroundImage: `url(${config.img}${result.roomPhoto})` })} />
          </Carousel.Item>
            }
          {result.homePhotosWithOrder && result.homePhotosWithOrder.length > 0 &&
              parsePhotoOrder(result.homePhotosWithOrder).map(photo => {
                return (
                  <Carousel.Item key={shortid()}>
                    <div style={Object.assign({}, styles.searchResultCarouselImg, { backgroundImage: `url(${config.img}${photo})` })} />
                  </Carousel.Item>
                )
              })
            }
        </Carousel>
        <div style={styles.searchResultBottomHalf}>
          <div style={styles.searchResultInfo}>
            <div style={styles.searchResultText}>
              <div style={styles.searchResultTitle}>
                {t('common.home_of', { first_name: result.hostName })}
              </div>
              <div style={styles.searchResultSubtitle}>
                {t(`homes.home_types.${result.homeType}`)} > {result.homeCity} {result.homeNeighbourhood && <span>({result.homeNeighbourhood})</span>}
              </div>
            </div>
            <div style={Object.assign({}, styles.searchResultHostImg, { backgroundImage: `url(${config.img}${result.hostPhoto})` })} />
          </div>
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
