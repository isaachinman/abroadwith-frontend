// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { isLoaded, load as loadEducator } from 'redux/modules/publicData/educators/loadEducator'
import { Alert, Button, Col, FormControl, FormGroup, Image, Row, Panel } from 'react-bootstrap'
import { createEducatorReview } from 'redux/modules/privateData/reviews/reviews'
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

    const result = !isLoaded(getState(), params.educatorID) ? dispatch(loadEducator(params.educatorID)) : null
    return __CLIENT__ ? null : result

  },
}])
@connect(
  (state, ownProps) => ({
    token: state.auth.token,
    educator: state.publicData.educators[ownProps.params.educatorID],
    reviews: state.privateData.reviews,
  })
)
@translate()
export default class ReviewEducator extends Component {

  state = {
    educatorId: parseInt(this.props.params.educatorID),
    valueForMoneyRating: 0,
    teachingRating: 0,
    locationRating: 0,
    description: null,
  }

  createHomeReview = () => {
    const { dispatch, token } = this.props
    dispatch(createEducatorReview(token, this.state))
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

    const { educator, reviews, t } = this.props
    const formIsValid = this.validateForm()

    console.log(this)

    return (
      <Panel
        header={<h4>{t('review.tell_us_about_experience', { other_person: educator.schoolName })}</h4>}
        style={styles.panel}
      >
        {!reviews.loaded &&
          <span>
            <Row>
              <Col xs={12}>
                <Alert bsStyle='info'>
                  <p>
                    {t('review.review_educator.you_took_course', { educator_name: educator.schoolName })}
                        &nbsp;
                    {t('review.review_educator.help_other_students')}
                  </p>
                </Alert>
                <Image src={`${config.img}${educator.image}`} thumbnail />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h4>{t('review.please_give_star_rating', { other_person: educator.schoolName })}</h4>
                <p>
                  {t('review.review_educator.stars_explanation')}
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.review_educator.value_for_money_rating_title')}:</h5>
                <p className='text-muted'>
                  {t('review.review_educator.value_for_money_rating_explanation')}
                </p>
                <div>
                  <Rate
                    onChange={value => this.handleValueChange('valueForMoneyRating', value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.review_educator.teaching_rating_title')}:</h5>
                <p className='text-muted'>
                  {t('review.review_educator.teaching_rating_explanation')}
                </p>
                <div>
                  <Rate
                    onChange={value => this.handleValueChange('teachingRating', value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.review_educator.location_rating_title')}:</h5>
                <p className='text-muted'>
                  {t('review.review_educator.location_rating_explanation')}
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
                <h5>{t('review.written_review')}:</h5>
                <p>
                  {t('review.your_review_will_be_public', { other_person: educator.schoolName })}
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

ReviewEducator.propTypes = {
  educator: PropTypes.object,
  dispatch: PropTypes.func,
  reviews: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  params: PropTypes.object,
}
