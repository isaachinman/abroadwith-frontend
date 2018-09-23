// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { isLoaded, load as loadUser } from 'redux/modules/publicData/users/loadUser'
import { Alert, Button, Col, FormControl, FormGroup, Image, Row, Panel } from 'react-bootstrap'
import { createUserReview } from 'redux/modules/privateData/reviews/reviews'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'
import config from 'config'
import Rate from 'antd/lib/rate'

// Styles
const styles = {
  imgContainer: {
    textAlign: 'center',
  },
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
    const result = !isLoaded(getState(), params.userID) ? dispatch(loadUser(params.userID)) : null
    return __CLIENT__ ? null : result
  },
}])
@connect(
  (state, ownProps) => ({
    user: state.publicData.users[ownProps.params.userID],
    token: state.auth.token,
    reviews: state.privateData.reviews,
  })
)
@translate()
export default class ReviewUser extends Component {

  state = {
    revieweeId: parseInt(this.props.params.userID),
    rating: 0,
    description: null,
  }

  createUserReview = () => {
    const { dispatch, token } = this.props
    dispatch(createUserReview(token, this.state))
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

    const { reviews, user, t } = this.props
    const formIsValid = this.validateForm()

    console.log('reviews: ', reviews)
    console.log('user: ', user)

    return (
      <Panel
        header={<h4>{t('review.tell_us_about_experience', { other_person: user.firstName })}</h4>}
        style={styles.panel}
      >
        {!reviews.loaded && user &&
          <span>
            <Row>
              <Col xs={12}>
                <Alert bsStyle='info'>
                  <p>
                    {t('review.review_user.you_hosted_guest', { other_person: user.firstName })}
                    &nbsp;
                    {t('review.review_home.help_other_guests')}
                  </p>
                </Alert>
                <div style={styles.imgContainer}>
                  <Image src={`${config.img}/users/default.jpg`} thumbnail />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h4>{t('review.please_give_star_rating', { other_person: user.firstName })}</h4>
                <p>
                  {t('review.review_user.stars_explanation')}
                </p>
                <div>
                  <Rate
                    onChange={value => this.handleValueChange('rating', value)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>{t('review.written_review')}:</h5>
                <p>
                  {t('review.your_review_will_be_public', { other_person: user.firstName })}
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
                <Button onClick={this.createUserReview} disabled={formIsValid} bsStyle='success'>{t('review.submit_btn')}</Button>
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

ReviewUser.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  reviews: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  params: PropTypes.object,
}
