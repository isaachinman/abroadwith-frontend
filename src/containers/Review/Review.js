// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Col, Grid, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import styles from './Review.styles'


@connect(
  state => ({
    reviews: state.privateData.reviews,
  })
)
@translate()
export default class Review extends Component {

  render() {
    const { reviews, t } = this.props
    return (
      <div>
        <Helmet title={t('review.title')} />
        <Grid style={styles.grid}>
          <Row style={styles.h1Row}>
            <Col xs={12}>
              <h1>{t('review.title')}</h1>
            </Col>
          </Row>

          <SpinLoader show={reviews.loading}>
            <Row>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </Row>
          </SpinLoader>

        </Grid>
      </div>
    )
  }
}

Review.propTypes = {
  children: PropTypes.element,
  reviews: PropTypes.object,
  t: PropTypes.func,
}
