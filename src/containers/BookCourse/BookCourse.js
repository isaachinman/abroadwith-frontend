// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { Button, Col, Collapse, ControlLabel, FormGroup, Tab, Pager, Panel, Row, Well } from 'react-bootstrap'
import { calculateCoursePriceWithinBooking, createCourseBooking, deletePotentialCourseBooking, updatePotentialCourseBooking } from 'redux/modules/privateData/bookings/courseBookings'
import Currencies from 'data/constants/Currencies'
import config from 'config'
import { connect } from 'react-redux'
import DefaultBankCurrencies from 'data/constants/DefaultBankCurrencies'
import Helmet from 'react-helmet'
import { isLoaded, load as loadEducator } from 'redux/modules/publicData/educators/loadEducator'
import jwtDecode from 'jwt-decode'
// import moment from 'moment'
import Steps from 'antd/lib/steps'
import Radium from 'radium'
import PaymentMethods from 'components/PaymentMethods/PaymentMethods'
import { SimpleSelect as Select } from 'react-selectize'
import { StickyContainer, Sticky } from 'react-sticky'
import { SpinLoader } from 'components'
import { uiDate } from 'utils/dates'
import { update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
import { scrollToTopOfPage } from 'utils/scrolling'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'

// Relative imports
import styles from './BookCourse.styles'

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {

    const state = getState()
    const educatorID = state.bookings.courseBookings.potentialBookingHelpers.educatorID
    return !isLoaded(state, educatorID) ? dispatch(loadEducator(educatorID)) : null

  },
}])
@connect(
  state => ({
    educator: state.publicData.educators[state.bookings.courseBookings.potentialBookingHelpers.educatorID],
    user: state.privateData.user.data,
    uiCurrency: state.ui.currency.value,
    token: state.auth.token,
    loading: state.bookings.courseBookings.loading,
    potentialBooking: state.bookings.courseBookings.potentialBooking,
    potentialBookingHelpers: state.bookings.courseBookings.potentialBookingHelpers,
  })
)
@translate()
@Radium
export default class BookCourse extends Component {

  state = {
    animationInProgress: false,
    activeStep: this.props.potentialBookingHelpers.completionStep,
    needsCountry: !this.props.user.address || !this.props.user.address.country,
  }

  componentWillMount = () => this.calculatePrice()

  componentDidMount = () => scrollToTopOfPage()

  componentWillReceiveProps = nextProps => {

    // Handle uiCurrency change
    if (this.props.uiCurrency !== nextProps.uiCurrency) {
      this.updatePotentialCourseBooking('currency', nextProps.uiCurrency)
      this.calculatePrice(nextProps.uiCurrency)
    }

  }

  // componentWillUpdate = (nextProps, nextState) => {
  //   if (this.state.activeStep !== nextState.activeStep) {
  //
  //     // Ensure the page is scrolled all the way up
  //     window.scrollTo(0, 0)
  //
  //   }
  // }

  updatePotentialCourseBooking = (field, value) => {
    const { dispatch, potentialBooking } = this.props
    const newPotentialBooking = Object.assign({}, potentialBooking, { [field]: value })
    dispatch(updatePotentialCourseBooking(newPotentialBooking))
  }

  updateUserCountry = country => {
    const { dispatch, token, user } = this.props
    const newObject = Object.assign({}, user, { address: { country } })
    dispatch(updateUser(jwtDecode(token).rid, newObject, token))
  }

  calculatePrice = overrideCurrency => {
    const { dispatch, potentialBooking } = this.props
    dispatch(calculateCoursePriceWithinBooking(overrideCurrency ? Object.assign({}, potentialBooking, { currency: overrideCurrency }) : potentialBooking))
  }

  changeStep = stepNum => this.setState({ activeStep: stepNum, animationInProgress: true }, () => setTimeout(() => this.setState({ animationInProgress: false }), 300))

  processBookingRequest = () => {

    /* -------------------------------------------------------------------------

    This is the function that gets called on the final "book request" button

      There are several actions which need to be performed:
        1. Create actual course booking request (required)

      Methodology: perform optional steps first, and then hook redirect into
      mandatory step as final callback

    --------------------------------------------------------------------------*/

    const { dispatch, token, user, potentialBooking } = this.props

    const checkoutActions = []

    // Update userType if required
    if (['HOST', 'MULTI_HOME_HOST'].includes(user.feUserType)) {
      checkoutActions.push(dispatch(updateUser(jwtDecode(token).rid, Object.assign({}, user, {
        feUserType: user.feUserType === 'HOST' ? 'STUDENT_AND_HOST' : 'STUDENT_AND_MULTI_HOME_HOST',
      }), token)))
    }

    // Create actual course booking request (required)
    checkoutActions.push(dispatch(createCourseBooking(token, Object.assign({}, potentialBooking, {
      paymentMethodId: user.paymentMethods[0].id,
    }))))

    // Execute all actions asynchronously
    Promise.all(checkoutActions).then(() => {
      dispatch(push('/book-course/success'))

      // Not the nicest, but it works (routing isn't trustworthy benchmark of load/unload for components)
      setTimeout(() => dispatch(deletePotentialCourseBooking()), 1000)

    })

  }

  render() {

    console.log(this)

    const { activeStep, animationInProgress, needsCountry } = this.state
    const { educator, user, loading, t, token, potentialBooking, potentialBookingHelpers } = this.props

    const currencySymbol = Currencies[potentialBooking.currency]

    // Determine total price
    const totalPrice = potentialBookingHelpers.price.data || 0

    // UI variables
    const showFullSummary = activeStep === 1
    const stickied = typeof window !== 'undefined' ? window.innerWidth > 767 && !showFullSummary : !showFullSummary

    // By default, the entire process is submittable as long as a user has at least one payment method
    const isProcessable = user.paymentMethods.length > 0 && user.address && user.address.country

    return (
      <div style={styles.grid} ref={node => this.containerNode = node} className='container' id='course-booking-flow-container'>

        <Helmet title={t('booking.course_booking.title')} />

        <div style={styles.contentContainer}>
          <SpinLoader show={loading}>
            <div style={styles.minHeightContainer}>
              <div>
                <Row>
                  <Col xs={12} md={6} mdOffset={3}>
                    <div style={styles.stepContainer}>
                      <Steps current={activeStep - 1/* No idea why, but antdesign zero indexed this component */}>
                        <Steps.Step title={t('booking.course_booking.step_1.title')} description={t('booking.course_booking.step_1.subtitle')} />
                        <Steps.Step title={t('booking.course_booking.step_2.title')} description={t('booking.course_booking.step_2.subtitle')} />
                      </Steps>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <StickyContainer>
                      <Well bsSize='large' style={styles.well}>
                        <Row>
                          <Col xs={12} md={showFullSummary ? 7 : 8} lg={showFullSummary ? 8 : 9} style={styles.widthTransition}>
                            <Tab.Container id='course-booking-flow' activeKey={activeStep} onSelect={() => {}}>
                              <Tab.Content>

                                <Tab.Pane eventKey={1}>
                                  <Row>
                                    <Col xs={12}>
                                      <h4>{t('booking.course_booking.step_1.title')}</h4>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col xs={12}>
                                      <PaymentMethods
                                        insideBooking
                                        user={user}
                                        token={token}
                                      />
                                    </Col>
                                  </Row>

                                  {needsCountry &&
                                    <Row>
                                      <Col xs={12} sm={8} md={6}>
                                        <FormGroup>
                                          <ControlLabel>{t('manage_home.location.country')}*</ControlLabel>
                                          <Select
                                            hideResetButton
                                            theme='bootstrap3'
                                            defaultValue={user.address && user.address.country ? user.address.country : null}
                                            onValueChange={value => this.updateUserCountry(value.value)}
                                          >
                                            {Object.keys(DefaultBankCurrencies).map(country => {
                                              return <option key={`home-country-${country}`} value={country}>{t(`countries.${country}`)}</option>
                                            })}
                                          </Select>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                      }

                                  <Row>
                                    <Col xs={12} sm={10}>
                                      <p className='text-muted'>{t('booking.charged_notification_course')}</p>
                                      <p className='text-muted'>
                                        <small>{t('booking.exchange_rate_disclaimer')}</small>
                                      </p>
                                    </Col>
                                  </Row>

                                </Tab.Pane>

                                <Tab.Pane eventKey={2}>
                                  <Row>
                                    <Col xs={12}>
                                      <h4>{t('booking.booking_summary')}</h4>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col xs={12} sm={3}><strong>{t('booking.course')}</strong></Col>
                                    <Col xs={12} sm={9}>{potentialBookingHelpers.courseName}</Col>
                                  </Row>
                                  <Row>
                                    <Col xs={12} sm={3}><strong>{t('common.Language')}</strong></Col>
                                    <Col xs={12} sm={9}>{t(`languages.${potentialBookingHelpers.language}`)} ({potentialBooking.level})</Col>
                                  </Row>
                                  <Row>
                                    <Col xs={12} sm={3}><strong>{t('booking.result_dates')}</strong></Col>
                                    <Col xs={12} sm={9}>{uiDate(potentialBooking.startDate)} &rarr; {uiDate(potentialBooking.endDate)}</Col>
                                  </Row>
                                  <Row>
                                    <Col xs={12} sm={3}><strong>{t('schools.student_name')}</strong></Col>
                                    <Col xs={12} sm={9}>{potentialBooking.studentName}</Col>
                                  </Row>
                                  <Row style={{ marginTop: 60 }}>
                                    <Col xs={12}>
                                      <Button onClick={this.processBookingRequest} bsSize='large' bsStyle='success'>{t('booking.request_booking')}</Button>
                                    </Col>
                                  </Row>
                                </Tab.Pane>

                              </Tab.Content>
                            </Tab.Container>
                          </Col>
                          <Col xs={12} md={showFullSummary ? 5 : 4} lg={showFullSummary ? 4 : 3} style={styles.widthTransition}>
                            <Sticky
                              isActive={stickied}
                              topOffset={-100}
                              stickyStyle={{ paddingTop: 80 }}
                            >
                              <Panel style={styles.overviewPanel}>
                                <div style={Object.assign({}, styles.homeImage, { backgroundImage: `url(${config.img}${educator.image})` })} />

                                <Collapse in={showFullSummary}>
                                  <div style={animationInProgress ? { color: 'white' } : {}}>
                                    <Row>
                                      <Col xs={12}>
                                        <div style={styles.borderBottom}>
                                          <p>
                                            <span>{t('common.Language')}</span><span className='pull-right'>{t(`languages.${potentialBookingHelpers.language}`)} ({potentialBooking.level})</span>
                                          </p>
                                          <p>
                                            <span>{t('booking.result_dates')}</span><small className='pull-right'>{uiDate(potentialBooking.startDate)} &rarr; {uiDate(potentialBooking.endDate)}</small>
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col xs={12}>
                                        <div style={styles.borderBottom}>
                                          <p>
                                            <span>{t('booking.course')}</span><span className='pull-right'>{potentialBookingHelpers.courseName}</span>
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row />
                                  </div>
                                </Collapse>
                                <Row>
                                  <Col xs={12}>
                                    <div>
                                      <strong style={styles.totalPriceLabel}>{t('booking.total_price')}</strong>
                                      {!potentialBookingHelpers.price.loading ? <span className='pull-right'>{currencySymbol}<span style={styles.totalPrice}>{(totalPrice).toFixed(2)}</span></span> : <span className='pull-right'>-</span>}
                                    </div>
                                  </Col>
                                </Row>
                              </Panel>
                            </Sticky>
                          </Col>
                        </Row>
                      </Well>
                    </StickyContainer>
                  </Col>
                </Row>
                <Pager style={styles.pager} onSelect={this.changeStep}>
                  {activeStep > 1 &&
                    <Pager.Item
                      eventKey={activeStep - 1}
                      previous
                    >
                          &larr; {t(`booking.course_booking.step_${activeStep - 1}.title`)}
                    </Pager.Item>
                      }
                  {(activeStep === 1 && !isProcessable) &&
                    <Pager.Item
                      disabled
                      next
                    >
                      <div>{t(`booking.course_booking.step_${activeStep + 1}.title`)} &rarr;</div>
                    </Pager.Item>
                      }
                  {(activeStep === 1 && isProcessable) &&
                    <Pager.Item
                      eventKey={activeStep + 1}
                      next
                    >
                      {t(`booking.course_booking.step_${activeStep + 1}.title`)} &rarr;
                        </Pager.Item>
                      }
                </Pager>
              </div>
            </div>
          </SpinLoader>
        </div>

      </div>
    )
  }
}

BookCourse.propTypes = {
  dispatch: PropTypes.func,
  educator: PropTypes.object,
  loading: PropTypes.bool,
  uiCurrency: PropTypes.string,
  user: PropTypes.object,
  upsellSearch: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  potentialBooking: PropTypes.object,
  potentialBookingHelpers: PropTypes.object,
}
