// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Carousel } from 'react-bootstrap'
import Currencies from 'data/constants/Currencies'
import config from 'config'
import { Link } from 'react-router'
import { updateActiveRoom } from 'redux/modules/ui/search/homestaySearch'
import { translate } from 'react-i18next'
import parsePhotoOrder from 'utils/homes/parsePhotoOrder'
import Radium from 'radium'
import shortid from 'shortid'

// Relative imports
import styles from '../SearchHomestays.styles'

@connect(
  state => ({
    roomHovered: state.ui.hoverables.roomHovered,
  })
)
@translate()
@Radium
export default class SmallResult extends Component {

  handleClick = () => this.props.dispatch(updateActiveRoom(this.props.result.roomId))

  render() {

    const { currency, t, result } = this.props

    return (
      <div
        key={result.roomId}
        style={styles.smallResult}
      >
        <Link onClick={this.handleClick} to={`/homestay/${result.homeId}`} style={styles.overlayLink} />
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
    )
  }
}

SmallResult.propTypes = {
  currency: PropTypes.string,
  dispatch: PropTypes.func,
  t: PropTypes.func,
  result: PropTypes.object,
  roomHovered: PropTypes.number,
}
