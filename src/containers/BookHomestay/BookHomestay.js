// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { Button, Col, Collapse, ControlLabel, Fade, FormControl, FormGroup, Tab, Pager, Panel, Row, Well } from 'react-bootstrap'
import {
  calculateHomestayPriceWithinBooking,
  createHomestayBooking,
  deletePotentialHomestayBooking,
  updatePotentialHomestayBooking,
  addDiscountCode,
  removeDiscountCode,
} from 'redux/modules/privateData/bookings/homestayBookings'
import { createCourseBooking } from 'redux/modules/privateData/bookings/courseBookings'
import { createNewThreadWithHost } from 'redux/modules/privateData/messaging/messaging'
import Currencies from 'data/constants/Currencies'
import config from 'config'
import { connect } from 'react-redux'
import DefaultBankCurrencies from 'data/constants/DefaultBankCurrencies'
import Helmet from 'react-helmet'
import HomeData from 'data/constants/HomeData'
import { isLoaded, load as loadHomestay } from 'redux/modules/publicData/homes/loadHome'
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import Steps from 'antd/lib/steps'
import Radium from 'radium'
import { performCourseUpsellSearch } from 'redux/modules/ui/search/courseSearch'
import PaymentMethods from 'components/PaymentMethods/PaymentMethods'
import { SimpleSelect as Select, MultiSelect } from 'react-selectize'
import { StickyContainer, Sticky } from 'react-sticky'
import { SpinLoader, FormInput } from 'components'
import { uiDate } from 'utils/dates'
import { update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
import UpsellCourseSearch from 'components/UpsellCourseSearch/UpsellCourseSearch'
import { scrollToTopOfPage } from 'utils/scrolling'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'
import debounce from 'debounce'

// Relative imports
import styles from './BookHomestay.styles'

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {

    const state = getState()
    const homeID = state.bookings.homestayBookings.potentialBookingHelpers.homeID
    return !isLoaded(state, homeID) ? dispatch(loadHomestay(homeID)) : null

  },
}])
@connect(
  state => ({
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    homestays: state.publicData.homestays,
    user: state.privateData.user.data,
    uiCurrency: state.ui.currency.value,
    token: state.auth.token,
    loading: state.bookings.homestayBookings.loading,
    potentialBooking: state.bookings.homestayBookings.potentialBooking,
    potentialBookingHelpers: state.bookings.homestayBookings.potentialBookingHelpers,
    discountCode: state.bookings.homestayBookings.discountCode,
  })
)
@translate()
@Radium
export default class BookHomestay extends Component {

  state = {
    animationInProgress: false,
    activeStep: this.props.potentialBookingHelpers.completionStep,
    needsCountry: !this.props.user.address || !this.props.user.address.country,
    upsellSearchInitialised: false,
    messageToBeSentToHost: null,
    discountCode: {
      value: null,
      isValid: null,
      isLoading: false,
    },
  }

  componentWillMount = () => this.calculatePrice()

  componentDidMount = () => {

    // Ensure the page is scrolled all the way up
    scrollToTopOfPage()

    // Perform course upsell search
    this.performCourseUpsellSearch()

  }

  componentWillReceiveProps = nextProps => {

    // Initial upsell search
    if (!this.state.upsellSearchInitialised && this.props.upsellSearch.loading && nextProps.upsellSearch.loaded) {
      this.setState({ upsellSearchInitialised: true })
    }

    // Handle uiCurrency change
    if (this.props.uiCurrency !== nextProps.uiCurrency) {
      this.updatePotentialHomestayBooking('currency', nextProps.uiCurrency)
      this.calculatePrice(nextProps.uiCurrency)
    }

  }

  componentWillUpdate = (nextProps, nextState) => {
    if (this.state.activeStep !== nextState.activeStep) {

      // Ensure the page is scrolled all the way up
      window.scrollTo(0, 0)

    }
  }

  performCourseUpsellSearch = () => {

    const { dispatch, token, potentialBooking, potentialBookingHelpers, upsellSearch } = this.props

    dispatch(performCourseUpsellSearch(token, Object.assign({}, upsellSearch.params, {
      centerPoint: {
        lat: potentialBookingHelpers.homeLat,
        lng: potentialBookingHelpers.homeLng,
      },
      currency: potentialBooking.currency,
      language: potentialBooking.languageHostWillTeach,
      startDate: potentialBooking.arrivalDate,
      endDate: potentialBooking.departureDate,
    })))
  }

  updateUserCountry = country => {
    const { dispatch, token, user } = this.props
    const newObject = { ...user, address: { country } }
    dispatch(updateUser(jwtDecode(token).rid, newObject, token))
  }

  handleDietChange = diet => {
    const newSettings = this.props.potentialBooking.settingNames.filter(setting => !HomeData.homeServices.FOOD_OPTION.includes(setting))
    diet.map(dietaryOption => newSettings.push(dietaryOption.value))
    this.updatePotentialHomestayBooking('settingNames', newSettings)
  }

  handleMealPlanChange = mealPlan => {
    const newServices = this.props.potentialBooking.serviceNames.filter(service => !HomeData.homeServices.MEAL_PLAN.includes(service))
    if (mealPlan.value === 'Half_board') newServices.push('HALF_BOARD')
    if (mealPlan.value === 'Full_board') newServices.push('FULL_BOARD')
    this.updatePotentialHomestayBooking('serviceNames', newServices)
    this.calculatePrice()
  }

  handleServicesChange = values => {
    const services = values.map(service => service.value)
    const newServices = this.props.potentialBooking.serviceNames.filter(service => !HomeData.homeServices.GENERAL.includes(service)).concat(services)
    this.updatePotentialHomestayBooking('serviceNames', newServices)
    this.calculatePrice()
  }

  handleWeeklyHoursChange = value => {
    this.updatePotentialHomestayBooking('weeklyHours', value)
    this.calculatePrice()
  }

  handleGuestCountChange = value => {
    this.updatePotentialHomestayBooking('guestCount', value)
    this.calculatePrice()
  }

  handleMessageChange = event => this.setState({ messageToBeSentToHost: event.target.value })

  handleDiscountChange = value => {
    this.setState({ discountCode: { value } })
  }

  updatePotentialHomestayBooking = (field, value) => {
    const { dispatch, potentialBooking } = this.props
    const newPotentialBooking = Object.assign({}, potentialBooking, { [field]: value })
    dispatch(updatePotentialHomestayBooking(newPotentialBooking))

    // If the learning language just changed, retrigger course search
    if (field === 'languageHostWillTeach') {
      this.performCourseUpsellSearch()
    }

  }

  calculatePrice = overrideCurrency => {
    const { dispatch, potentialBooking } = this.props
    dispatch(calculateHomestayPriceWithinBooking(overrideCurrency ? Object.assign({}, potentialBooking, { currency: overrideCurrency }) : potentialBooking))
  }

  changeStep = stepNum => this.setState({ activeStep: stepNum, animationInProgress: true }, () => setTimeout(() => this.setState({ animationInProgress: false }), 300))

  processBookingRequest = () => {

    /* -------------------------------------------------------------------------

    This is the function that gets called on the final "book request" button

      There are several actions which need to be performed:
        1. Create actual homestay booking request (required)
        2. Create course booking request (optional)
        3. Create new thread with message content (optional)
        4. Update userType if necessary (optional)

      Methodology: perform optional steps first, and then hook redirect into
      mandatory step as final callback

    --------------------------------------------------------------------------*/

    const { messageToBeSentToHost } = this.state
    const { dispatch, token, user, upsellSearch, potentialBooking, potentialBookingHelpers } = this.props

    const checkoutActions = []

    // Create new thread with message content (optional)
    if (messageToBeSentToHost) {
      checkoutActions.push(dispatch(createNewThreadWithHost(token, {
        arrival: potentialBooking.arrivalDate,
        departure: potentialBooking.departureDate,
        homeId: potentialBookingHelpers.homeID,
        message: messageToBeSentToHost,
      })))
    }

    // Create course booking request (optional)
    if (potentialBookingHelpers.upsellCourseBooking.courseId) {
      checkoutActions.push(dispatch(createCourseBooking(token, {
        courseId: potentialBookingHelpers.upsellCourseBooking.courseId,
        startDate: potentialBookingHelpers.upsellCourseBooking.startDate,
        endDate: potentialBookingHelpers.upsellCourseBooking.endDate,
        level: upsellSearch.params.level,
        studentName: `${user.firstName} ${user.lastName}`,
        currency: potentialBooking.currency,
        paymentMethodId: user.paymentMethods[0].id,
      })))
    }

    // Update userType if required
    if (['HOST', 'MULTI_HOME_HOST'].includes(user.feUserType)) {
      checkoutActions.push(dispatch(updateUser(jwtDecode(token).rid, Object.assign({}, user, {
        feUserType: user.feUserType === 'HOST' ? 'STUDENT_AND_HOST' : 'STUDENT_AND_MULTI_HOME_HOST',
      }), token)))
    }

    // Create actual homestay booking request (required)
    checkoutActions.push(dispatch(createHomestayBooking(token, Object.assign({}, potentialBooking, {
      paymentMethodId: user.paymentMethods[0].id,
    }))))

    // Execute all actions asynchronously
    Promise.all(checkoutActions).then(() => {
      dispatch(push('/book-homestay/success'))

      // Not the nicest, but it works (routing isn't trustworthy benchmark of load/unload for components)
      setTimeout(() => dispatch(deletePotentialHomestayBooking()), 1000)

    })

  }

  addDiscount = (code) => {
    const { dispatch, potentialBooking, potentialBookingHelpers } = this.props

    if (code.value.length > 7) {
      dispatch(addDiscountCode({ ...potentialBooking, partnerDiscountCode: code.value }, potentialBookingHelpers.price.data))
    }
  }

  removeDiscount = () => {
    const { dispatch, potentialBooking } = this.props
    this.setState({
      discountCode: {
        value: null,
        isValid: null,
        isLoading: false,
      },
    })

    dispatch(removeDiscountCode(potentialBooking))
  }

  render() {

    const { activeStep, animationInProgress, needsCountry, upsellSearchInitialised } = this.state
    const { user, upsellSearch, homestays, loading, t, token, potentialBooking, potentialBookingHelpers, discountCode } = this.props

    const currencySymbol = Currencies[potentialBooking.currency]
    const homestay = homestays[potentialBookingHelpers.homeID] ? homestays[potentialBookingHelpers.homeID] : {}
    const room = homestay.data.rooms.filter(r => r.id === potentialBooking.roomId)[0]

    const showUpsell = upsellSearch.loaded && upsellSearch.data && upsellSearch.data.results && upsellSearch.data.results.length > 0

    // Determine length of homestay
    const duration = moment(potentialBooking.departureDate).diff(moment(potentialBooking.arrivalDate), 'days')

    // Determine chosen meal plan
    let mealPlan = 'Breakfast'
    if (potentialBooking.serviceNames.includes('HALF_BOARD')) {
      mealPlan = 'Half_board'
    } else if (potentialBooking.serviceNames.includes('FULL_BOARD')) {
      mealPlan = 'Full_board'
    }

    // Determine special diet
    const specialDiet = potentialBooking.settingNames.filter(setting => HomeData.homeServices.FOOD_OPTION.includes(setting))

    // Determine extra services
    const extrasAvailable = homestay.data.pricing.extras.filter(extra => HomeData.homeServices.GENERAL.includes(extra.service) && extra.service !== 'EXTRA_GUEST')
    const extrasChosen = potentialBooking.serviceNames.filter(extra => HomeData.homeServices.GENERAL.includes(extra))

    // Determine extra costs
    const extraCosts = potentialBooking.serviceNames.map(service => {
      const cost = Object.assign({}, homestay.data.pricing.extras.filter(extra => service === extra.service)[0])
      cost.cost = (cost.cost / 7) * duration
      return cost
    })

    // Determine total price
    let totalPrice = potentialBookingHelpers.price.data
    if (potentialBookingHelpers.upsellCourseBooking.totalPrice) totalPrice += potentialBookingHelpers.upsellCourseBooking.totalPrice

    // UI variables
    const showFullSummary = activeStep === 1 || (showUpsell && activeStep === 4) || (!showUpsell && activeStep === 3)
    const stickied = typeof window !== 'undefined' ? window.innerWidth > 767 && !showFullSummary : !showFullSummary

    // By default, the entire process is submittable as long as a user has at least one payment method
    const isProcessable = user.paymentMethods.length > 0 && user.address && user.address.country

    return (
      <div style={styles.grid} ref={node => this.containerNode = node} className='container' id='homestay-booking-flow-container'>

        <Helmet title={t('booking.homestay_booking.title')} />

        <div style={styles.contentContainer}>
          <SpinLoader show={upsellSearch.loading || !upsellSearchInitialised || loading}>
            <div style={styles.minHeightContainer}>
              {upsellSearchInitialised &&
                <div>
                  <Row>
                    <Col xs={12}>
                      <div style={styles.stepContainer}>
                        <Steps current={activeStep - 1/* No idea why, but antdesign zero indexed this component */}>
                          <Steps.Step title={t('booking.homestay_booking.step_1.title')} description={t('booking.homestay_booking.step_1.subtitle')} />
                          {showUpsell && <Steps.Step title={t('booking.homestay_booking.step_2.title')} description={t('booking.homestay_booking.step_2.subtitle', { language: t(`languages.${potentialBooking.languageHostWillTeach}`) })} />}
                          <Steps.Step title={t('booking.homestay_booking.step_3.title')} description={t('booking.homestay_booking.step_3.subtitle')} />
                          <Steps.Step title={t('booking.homestay_booking.step_4.title')} description={t('booking.homestay_booking.step_4.subtitle')} />
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
                              <Tab.Container id='homestay-booking-flow' activeKey={activeStep} onSelect={() => {}}>
                                <Tab.Content>

                                  <Tab.Pane eventKey={1}>
                                    <Row>
                                      <Col xs={12}>
                                        <h3>{t('booking.homestay_booking.step_1.title')}</h3>
                                      </Col>
                                    </Row>

                                    <Fade in={!animationInProgress}>
                                      <div style={styles.tripDetailsContainer}>
                                        <Row>
                                          <Col xs={12} sm={6}>
                                            <FormGroup>
                                              <ControlLabel>{t('common.Guests')}</ControlLabel>
                                              <Select
                                                hideResetButton
                                                theme='bootstrap3'
                                                value={{ value: potentialBooking.guestCount, label: potentialBooking.guestCount }}
                                                onValueChange={value => this.handleGuestCountChange(parseInt(value.value))}
                                              >
                                                {room.vacancies >= 1 && <option value='1'>1</option>}
                                                {room.vacancies >= 2 && <option value='2'>2</option>}
                                                {room.vacancies >= 3 && <option value='3'>3</option>}
                                                {room.vacancies >= 4 && <option value='4'>4</option>}
                                              </Select>
                                            </FormGroup>
                                          </Col>

                                          <Col xs={12} sm={6}>
                                            <FormGroup>
                                              <ControlLabel>{t('booking.meal_plan')}</ControlLabel>
                                              <Select
                                                hideResetButton
                                                theme='bootstrap3'
                                                value={{ value: mealPlan, label: t(`common.${mealPlan}`) }}
                                                onValueChange={this.handleMealPlanChange}
                                              >
                                                <option value='Breakfast'>{t('common.Breakfast')}</option>
                                                {homestay.data.pricing.extras.map(extra => {
                                                  if (extra.service === 'HALF_BOARD') {
                                                    return <option key='halfb' value='Half_board'>{t('common.Half_board')}</option>
                                                  } else if (extra.service === 'FULL_BOARD') {
                                                    return <option key='fullb' value='Full_board'>{t('common.Full_board')}</option>
                                                  }
                                                })}
                                              </Select>
                                            </FormGroup>
                                          </Col>

                                        </Row>
                                        <Row>

                                          <Col xs={12} sm={6}>
                                            <FormGroup>
                                              <ControlLabel>{t('booking.diet_label')}</ControlLabel>
                                              <MultiSelect
                                                hideResetButton
                                                theme='bootstrap3'
                                                placeholder={t('common.none')}
                                                values={specialDiet.map(diet => {
                                                  return { label: t(`homes.diets_offered.${diet}`), value: diet }
                                                })}
                                                onValuesChange={this.handleDietChange}
                                              >
                                                {homestay.data.basics.FOOD_OPTION.map(foodOption => {
                                                  return (
                                                    <option key={`diet-${foodOption}`} value={foodOption}>{t(`homes.diets_offered.${foodOption}`)}</option>
                                                  )
                                                })}
                                              </MultiSelect>
                                            </FormGroup>
                                          </Col>

                                          <Col xs={12} sm={6}>
                                            <FormGroup>
                                              <ControlLabel>{t('common.Services')}</ControlLabel>
                                              <MultiSelect
                                                hideResetButton
                                                theme='bootstrap3'
                                                placeholder={t('common.none')}
                                                values={extrasChosen.map(extra => ({ value: extra, label: t(`homes.extras.${extra}`) }))}
                                                onValuesChange={this.handleServicesChange}
                                              >
                                                {extrasAvailable.map(extra => <option key={`service-${extra.service}`} value={extra.service}>{t(`homes.extras.${extra.service}`)}</option>)}
                                              </MultiSelect>
                                            </FormGroup>
                                          </Col>

                                        </Row>
                                        <Row>

                                          <Col xs={12} sm={6}>
                                            <FormGroup>
                                              <ControlLabel>{t('common.learning_language_label')}</ControlLabel>
                                              <Select
                                                hideResetButton
                                                theme='bootstrap3'
                                                value={{ value: potentialBooking.languageHostWillTeach, label: t(`languages.${potentialBooking.languageHostWillTeach}`) }}
                                                onValueChange={value => this.updatePotentialHomestayBooking('languageHostWillTeach', value.value)}
                                              >
                                                {homestay.data.immersions[potentialBookingHelpers.immersionType].languagesOffered.map(lang => {
                                                  return (
                                                    <option key={`learn-${lang}`} value={lang}>{t(`languages.${lang}`)}</option>
                                                  )
                                                })}
                                              </Select>
                                            </FormGroup>
                                          </Col>

                                          {potentialBookingHelpers.immersionType === 'tandem' &&
                                            <Col xs={12} sm={6}>
                                              <FormGroup>
                                                <ControlLabel>{t('booking.teaching')}</ControlLabel>
                                                <Select
                                                  hideResetButton
                                                  theme='bootstrap3'
                                                  value={{ value: potentialBooking.languageGuestWillTeach, label: t(`languages.${potentialBooking.languageGuestWillTeach}`) }}
                                                  onValueChange={value => this.updatePotentialHomestayBooking('languageGuestWillTeach', value.value)}
                                                >
                                                  {homestay.data.immersions.tandem.languagesInterested.map(lang => {
                                                    return (
                                                      <option key={`tandem=${lang.lang}`} value={lang.lang}>{t(`languages.${lang.lang}`)}</option>
                                                    )
                                                  })}
                                                </Select>
                                              </FormGroup>
                                            </Col>
                                          }

                                          {potentialBookingHelpers.immersionType === 'teacher' &&
                                            <Col xs={12} sm={6}>
                                              <FormGroup>
                                                <ControlLabel>{t('booking.hours_per_week')}</ControlLabel>
                                                <Select
                                                  hideResetButton
                                                  theme='bootstrap3'
                                                  value={{ value: potentialBooking.weeklyHours, label: potentialBooking.weeklyHours }}
                                                  onValueChange={value => this.handleWeeklyHoursChange(value.value)}
                                                >
                                                  {homestay.data.immersions.teacher.packages.map(pkg => {
                                                    return (
                                                      <option key={`teacher-pkg-${pkg}`} value={pkg}>{`${pkg}`}</option>
                                                    )
                                                  })}
                                                </Select>
                                              </FormGroup>
                                            </Col>
                                          }

                                        </Row>

                                      </div>
                                    </Fade>
                                  </Tab.Pane>

                                  {showUpsell &&
                                  <Tab.Pane eventKey={2}>

                                    <Row>
                                      <Col xs={12}>
                                        <h3>{t('booking.homestay_booking.step_2.title')}</h3>
                                      </Col>
                                    </Row>

                                    <UpsellCourseSearch
                                      animationInProgress={animationInProgress}
                                    />

                                  </Tab.Pane>
                                }

                                  <Tab.Pane eventKey={showUpsell ? 3 : 2}>
                                    <Row>
                                      <Col xs={12}>
                                        <h4>{t('booking.homestay_booking.step_3.title')}</h4>
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
                                      { this.state.discountCode.value && discountCode.isValid ?
                                        <Col sm={6} xs={12}>
                                          <ControlLabel>You have a discount coupon</ControlLabel>
                                          <div>
                                            <span>#{this.state.discountCode.value} <span style={{ color: '#a94442', fontSize: 12 }}>(-{currencySymbol}{discountCode.value.toFixed(2)})</span></span>
                                            <a style={{ marginLeft: 5, fontSize: 12 }} onClick={this.removeDiscount}>Remove</a>
                                          </div>
                                        </Col> :
                                        <FormInput
                                          colSm={5}
                                          label='Do you have a discount coupon?'
                                          placeholder='Enter here your coupon'
                                          successFeedback='Wow! This coupon granted you €132 off on your booking'
                                          errorFeedback='Hupsi! This coupon seems to be invalid'
                                          isValid={discountCode.isValid}
                                          value={this.state.discountCode.value}
                                          onDebounce={debounce(this.addDiscount, 750)}
                                          onChange={({ event }) => this.handleDiscountChange(event.value)}
                                          loading={discountCode.loading}
                                          notRequired
                                        />
                                      }
                                    </Row>

                                    <Row>
                                      <Col xs={12} sm={10}>
                                        <p className='text-muted'>{t('booking.charged_notification')}</p>
                                        <p className='text-muted'>
                                          <small>{t('booking.exchange_rate_disclaimer')}</small>
                                        </p>
                                      </Col>
                                    </Row>

                                  </Tab.Pane>

                                  <Tab.Pane eventKey={showUpsell ? 4 : 3}>
                                    <Row>
                                      <Col xs={12}>
                                        <h4>{t('booking.booking_summary')}</h4>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col xs={12}>
                                        <h6 className='header-green'>{t('booking.message_placeholder')}</h6>
                                      </Col>
                                      <Col xs={12} md={10}>
                                        <FormGroup controlId='new-thread'>
                                          <FormControl
                                            componentClass='textarea'
                                            placeholder={t('inbox.message_modal_placeholder')}
                                            style={styles.textarea}
                                            value={this.state.messageToBeSentToHost || ''}
                                            onChange={this.handleMessageChange}
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <Row>
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
                                  <div style={Object.assign({}, styles.homeImage, { backgroundImage: `url(${config.img}${homestay.data.images[0].imagePath})` })} />

                                  <Collapse in={showFullSummary}>
                                    <div style={animationInProgress ? { color: 'white' } : {}}>
                                      <Row>
                                        <Col xs={12}>
                                          <div style={styles.borderBottom}>
                                            <p>
                                              <span>{t('common.Immersion')}</span><span className='pull-right'>{t(`immersions.${potentialBookingHelpers.immersionType}`)}</span>
                                            </p>
                                            <p>
                                              <span className='hidden-xs'>{t('common.Dates')}</span><small className='pull-right'>{uiDate(potentialBooking.arrivalDate)} &rarr; {uiDate(potentialBooking.departureDate)}</small>
                                            </p>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col xs={12}>
                                          <div style={styles.borderBottom}>
                                            <p>
                                              <span>{t('booking.room_name')}</span><span className='pull-right'>{room.name}</span>
                                            </p>
                                            <p>
                                              <span>{t('common.Guests')}</span><span className='pull-right'>{potentialBooking.guestCount}</span>
                                            </p>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col xs={12}>
                                          {extraCosts.length > 0 &&
                                            <div style={styles.extraCostsList}>
                                              <span>{t('booking.extras')}</span>
                                              <div style={styles.servicesListContainer} className='pull-right'>
                                                {extraCosts.map(cost => {
                                                  return (
                                                    <span key={`extra-cost-${cost.service}`}>{t(`homes.services.${cost.service}`)}{extraCosts.indexOf(cost) !== extraCosts.length - 1 ? <span>,&nbsp;</span> : null}</span>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          }
                                          {potentialBookingHelpers.upsellCourseBooking.courseId &&
                                            <div style={styles.extraCostsList}>
                                              <span>{t('booking.language_course')}</span>
                                              <div style={styles.servicesListContainer} className='pull-right'>
                                                {currencySymbol}{potentialBookingHelpers.upsellCourseBooking.totalPrice}
                                              </div>
                                            </div>
                                          }

                                        </Col>
                                      </Row>
                                    </div>
                                  </Collapse>
                                  <Row>
                                    <Col xs={12}>
                                      { this.state.discountCode.value && discountCode.isValid &&
                                        <div style={[styles.extraCostsList, { borderBottom: '1px solid rgb(221, 221, 221)', paddingBottom: 10 }]}>
                                          <span>Discount</span>
                                          <div style={[styles.servicesListContainer, { color: '#a94442' }]} className='pull-right'>
                                            -{currencySymbol}{discountCode.value.toFixed(2)}
                                          </div>
                                        </div>
                                      }
                                      <div>
                                        <strong style={styles.totalPriceLabel}>{t('booking.total_price')}</strong>
                                        {!potentialBookingHelpers.price.loading ? <span className='pull-right'>{currencySymbol}<span style={styles.totalPrice}>{totalPrice && (totalPrice).toFixed(2)}</span></span> : <span className='pull-right'>-</span>}
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
                        &larr; {t(`booking.homestay_booking.step_${activeStep > 2 && !showUpsell ? activeStep : activeStep - 1}.title`)}
                      </Pager.Item>
                    }
                    {((showUpsell && activeStep === 3 && !isProcessable) || (!showUpsell && activeStep === 2 && !isProcessable)) &&
                      <Pager.Item
                        disabled
                        next
                      >
                        <div>{t(`booking.homestay_booking.step_${activeStep === 1 && !showUpsell ? activeStep + 2 : activeStep + 1}.title`)} &rarr;</div>
                      </Pager.Item>
                    }
                    {(((showUpsell && activeStep < 3) || (!showUpsell && activeStep < 2)) || ((showUpsell && activeStep === 3 && isProcessable) || (!showUpsell && activeStep === 2 && isProcessable))) &&
                      <Pager.Item
                        eventKey={activeStep + 1}
                        next
                      >
                        {t(`booking.homestay_booking.step_${(activeStep === 1 || activeStep === 2) && !showUpsell ? activeStep + 2 : activeStep + 1}.title`)} &rarr;
                      </Pager.Item>
                    }
                  </Pager>
                </div>
              }
            </div>
          </SpinLoader>
        </div>

      </div>
    )
  }
}

BookHomestay.propTypes = {
  dispatch: PropTypes.func,
  homestays: PropTypes.object,
  loading: PropTypes.bool,
  uiCurrency: PropTypes.string,
  user: PropTypes.object,
  upsellSearch: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  potentialBooking: PropTypes.object,
  potentialBookingHelpers: PropTypes.object,
  discountCode: PropTypes.object,
}
