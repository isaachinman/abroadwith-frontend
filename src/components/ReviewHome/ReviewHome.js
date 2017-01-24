// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { isLoaded, load as loadHomestay } from 'redux/modules/publicData/homes/loadHome'
import { Alert, Button, Col, FormControl, FormGroup, Image, Row, Panel } from 'react-bootstrap'
import { createHomeReview } from 'redux/modules/privateData/reviews/reviews'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'
import config from 'config'
import Rate from 'antd/lib/rate'

// Styles
const styles = {
  panel: {
    boxShadow: '5px 5px 12px 0 rgba(0,0,0,0.15)',
  },
  textbox: {
    minHeight: 160,
  },
  redirectBtn: {
    marginTop: 20,
  },
}

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const result = !isLoaded(getState(), params.homeID) ? dispatch(loadHomestay(params.homeID)) : null
    return __CLIENT__ ? null : result

  },
}])
@connect(
  (state, ownProps) => ({
    token: state.auth.token,
    homestay: state.publicData.homestays[ownProps.params.homeID],
    error: state.publicData.homestays.error,
    loading: state.publicData.homestays.loading,
    reviews: state.privateData.reviews,
  })
)
@translate()
export default class ReviewHome extends Component {

  state = {
    homeId: parseInt(this.props.params.homeID),
    languageCultureLearningRating: 0,
    foodRating: 0,
    locationRating: 0,
    cleanlinessRating: 0,
    roomRating: 0,
    description: null,
  }

  createHomeReview = () => {
    const { dispatch, token } = this.props
    dispatch(createHomeReview(token, this.state))
  }

  redirectHome = () => {
    this.props.dispatch(push('/'))
  }

  handleValueChange = (field, value) => {
    const newState = Object.assign({}, this.state)
    newState[field] = value
    this.setState(newState)
  }

  validateForm = () => {
    return Object.values(this.state).some(value => !value)
  }

  render() {

    const { homestay, reviews, t } = this.props
    const formIsValid = this.validateForm()
    console.log(this)

    return (
      <Panel
        header={<h4>{t('review.tell_us_about_experience', { other_person: homestay.host.firstName })}</h4>}
        style={styles.panel}
      >
        {!reviews.loaded &&
          <span>
            <Row>
              <Col xs={12}>
                <Alert bsStyle='info'>
                  <p>
                    {t('review.review_home.you_stayed_in', { other_person: homestay.host.firstName })}
                    &nbsp;
                    {t('review.review_home.help_other_guests')}
                  </p>
                </Alert>
                <Image src={`${config.img}${homestay.images[0].imagePath}`} thumbnail />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h4>{t('review.please_give_star_rating', { other_person: homestay.host.firstName })}</h4>
                <p>
                  {t('review.review_home.stars_explanation')}
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.review_home.food_rating_title')}:</h5>
                <p className='text-muted'>
                  {t('review.review_home.food_rating_explanation')}
                </p>
                <div>
                  <Rate
                    onChange={value => this.handleValueChange('foodRating', value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.review_home.language_culture_rating_title')}:</h5>
                <p className='text-muted'>
                  {t('review.review_home.language_culture_rating_explanation')}
                </p>
                <div>
                  <Rate
                    onChange={value => this.handleValueChange('languageCultureLearningRating', value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.review_home.location_rating_title')}:</h5>
                <p className='text-muted'>
                  {t('review.review_home.location_rating_explanation')}
                </p>
                <div>
                  <Rate
                    onChange={value => this.handleValueChange('locationRating', value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.review_home.cleanliness_rating_title')}:</h5>
                <p className='text-muted'>
                  {t('review.review_home.cleanliness_rating_explanation')}
                </p>
                <div>
                  <Rate
                    onChange={value => this.handleValueChange('cleanlinessRating', value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.review_home.room_rating_title')}:</h5>
                <p className='text-muted'>
                  {t('review.review_home.room_rating_explanation')}
                </p>
                <div>
                  <Rate
                    onChange={value => this.handleValueChange('roomRating', value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.written_review')}:</h5>
                <p>
                  {t('review.your_review_will_be_public', { other_person: homestay.host.firstName })}
                </p>
                <FormGroup controlId='formControlsTextarea'>
                  <FormControl
                    maxLength={255}
                    componentClass='textarea'
                    placeholder={t('review.textbox_placeholder')}
                    style={styles.textbox}
                    onChange={event => this.handleValueChange('description', event.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Button onClick={this.createHomeReview} bsStyle='success' disabled={formIsValid}>{t('review.submit_btn')}</Button>
              </Col>
            </Row>
          </span>
        }
        {reviews.loaded &&
          <span>
            <Row>
              <Col xs={12}>
                <Alert bsStyle='success'>
                  <h4>{t('review.review_success_modal_title')}</h4>
                  <p>{t('review.review_success_modal_body')}</p>
                  <Button style={styles.redirectBtn} onClick={this.redirectHome}>{t('review.go_to_homepage')}</Button>
                </Alert>
              </Col>
            </Row>
          </span>
        }
      </Panel>
    )
  }
}

ReviewHome.propTypes = {
  children: PropTypes.element,
  dispatch: PropTypes.func,
  homestay: PropTypes.object,
  reviews: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  params: PropTypes.object,
}
