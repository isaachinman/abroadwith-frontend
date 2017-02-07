// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import config from 'config'
import { FirstInitialCircle } from 'components'
import Rate from 'antd/lib/rate'
import { uiDate } from 'utils/dates'
import { translate } from 'react-i18next'

// Relative imports
import styles from '../Homestay.styles'

@translate()
export default class HomestayReviews extends Component {

  render() {

    const { reviewInfo, t } = this.props

    return (
      <div className='homestay-review-display-section'>
        {(!reviewInfo || reviewInfo.reviews.length === 0) &&
          <h6 className='text-muted'>{t('homes.no_reviews')}</h6>
        }
        {reviewInfo && reviewInfo.reviews.length > 0 &&
          <span>
            <h6>{t('homes.summary')} <small>({reviewInfo.reviews.length} {t('common.reviews')})</small></h6>
            <Row>
              <Col xs={12} md={6} style={styles.reviewCategory}>
                <div>{t('review.review_home.cleanliness_rating_title')}</div>
                <Rate disabled defaultValue={reviewInfo.averageCleanlinessRating} />
              </Col>
              <Col xs={12} md={6} style={styles.reviewCategory}>
                <div>{t('review.review_home.food_rating_title')}</div>
                <Rate disabled defaultValue={reviewInfo.averageFoodRating} />
              </Col>
              <Col xs={12} md={6} style={styles.reviewCategory}>
                <div>{t('review.review_home.language_culture_rating_title')}</div>
                <Rate disabled defaultValue={reviewInfo.averageLanguageCultureLearningRating} />
              </Col>
              <Col xs={12} md={6} style={styles.reviewCategory}>
                <div>{t('review.review_home.location_rating_title')}</div>
                <Rate disabled defaultValue={reviewInfo.averageLocationRating} />
              </Col>
              <Col xs={12} md={6} style={styles.reviewCategory}>
                <div>{t('review.review_home.room_rating_title')}</div>
                <Rate disabled defaultValue={reviewInfo.averageRoomRating} />
              </Col>
            </Row>
              {reviewInfo.reviews.map(review => {
                return (
                  <div style={styles.reviewPanel} key={`home-review-${review.reviewerId}`}>
                    <div style={styles.reviewCaretLeftInner} />
                    <div style={styles.reviewCaretLeftOuter} />
                    <Row>
                      <div style={styles.reviewerInfo}>
                        {!review.reviewerPicture &&
                        <FirstInitialCircle letter={review.reviewerFirstName.substring(0, 1)} />
                      }
                        {review.reviewerPicture &&
                        <div style={Object.assign({}, styles.reviewerImage, { backgroundImage: `url(${config.img}${review.reviewerPicture})` })} />
                      }
                        <small className='text-muted'>{review.reviewerFirstName}</small>
                      </div>
                      <Col xs={12} style={styles.reviewContainer}>
                        <div>
                          {review.description}
                        </div>
                        <div style={styles.alignRight}>
                          <small className='text-muted'>{uiDate(review.date)}</small>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              })}
          </span>
        }
      </div>
    )
  }
}

HomestayReviews.propTypes = {
  reviewInfo: PropTypes.object,
  t: PropTypes.func,
}
