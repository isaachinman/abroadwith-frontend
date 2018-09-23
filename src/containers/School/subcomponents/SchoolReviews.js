// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import config from 'config'
import { FirstInitialCircle } from 'components'
// import Rate from 'antd/lib/rate'
import { uiDate } from 'utils/dates'
import shortid from 'shortid'
import { translate } from 'react-i18next'

// Relative imports
import styles from '../School.styles'

@translate()
export default class SchoolReviews extends Component {

  shouldComponentUpdate = () => false

  render() {

    const { reviews } = this.props

    return (
      <div className='homestay-review-display-section'>
        {reviews.map(review => {
          return (
            <div style={styles.reviewPanel} key={`home-review-${review.reviewerId || shortid()}`}>
              <Row>
                <div style={styles.reviewerInfo}>
                  {!review.reviewerPicture &&
                  <FirstInitialCircle small letter={review.reviewerFirstName.substring(0, 1)} />
                }
                  {review.reviewerPicture &&
                  <div style={Object.assign({}, styles.reviewerImage, { backgroundImage: `url(${config.img}${review.reviewerPicture})` })} />
                }
                  <div style={styles.reviewerName} className='text-muted'>{review.reviewerFirstName}</div>
                </div>
                <Col xs={12} style={styles.reviewContainer}>
                  <div>
                    {review.description}
                  </div>
                  <div style={styles.alignRight}>
                    <small className='text-muted'>{uiDate(review.createdAt)}</small>
                  </div>
                </Col>
              </Row>
            </div>
          )
        })}
      </div>
    )
  }
}

SchoolReviews.propTypes = {
  reviews: PropTypes.array,
  t: PropTypes.func,
}
