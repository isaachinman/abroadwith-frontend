// Absolute imports
import React, { Component, PropTypes } from 'react'
import { calculateHomestayPriceWithinBooking, updatePotentialHomestayBooking } from 'redux/modules/privateData/bookings/homestayBookings'
import Currencies from 'data/constants/Currencies'
import config from 'config'
import { connect } from 'react-redux'
import { Col, Collapse, ControlLabel, Fade, FormGroup, Grid, Tab, Pager, Panel, Row, Well } from 'react-bootstrap'
import Helmet from 'react-helmet'
import HomeData from 'data/constants/HomeData'
import moment from 'moment'
import Steps from 'antd/lib/steps'
import Radium from 'radium'
import { performCourseUpsellSearch } from 'redux/modules/ui/search/courseSearch'
import PaymentMethods from 'components/PaymentMethods/PaymentMethods'
import { SimpleSelect as Select, MultiSelect } from 'react-selectize'
import { StickyContainer, Sticky } from 'react-sticky'
import { SpinLoader } from 'components'
import { uiDate } from 'utils/dates'
import { translate } from 'react-i18next'

// Relative imports
import styles from './BookingHomestay.styles'
import UpsellCourseSearch from './subcomponents/UpsellCourseSearch'


@connect(
  state => ({
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    homestays: state.publicData.homestays,
    user: state.privateData.user.data,
    uiCurrency: state.ui.currency.value,
    token: state.auth.token,
    potentialBooking: state.bookings.homestayBookings.potentialBooking,
    potentialBookingHelpers: state.bookings.homestayBookings.potentialBookingHelpers,
  })
)
@translate()
@Radium
export default class BookingHomestay extends Component {

  state = {
    animationInProgress: false,
    activeStep: this.props.potentialBookingHelpers.completionStep,
    upsellSearchInitialised: false,
  }

  componentWillMount = () => this.calculatePrice()

  componentDidMount = () => {

    const { dispatch, token, potentialBooking, potentialBookingHelpers, upsellSearch } = this.props

    // Ensure the page is scrolled all the way up
    window.scrollTo(0, 0)

    // Perform course upsell search
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

  componentWillReceiveProps = nextProps => {

    // Initial upsell search
    if (!this.state.upsellSearchInitialised && this.props.upsellSearch.loading && nextProps.upsellSearch.loaded) {
      this.setState({ upsellSearchInitialised: true })
    }

    // Handle uiCurrency change
    if (this.props.uiCurrency !== nextProps.uiCurrency) {
      console.log('incoming currency: ', nextProps.uiCurrency)
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

  handleGuestCountChange = value => {
    this.updatePotentialHomestayBooking('guestCount', value)
    this.calculatePrice()
  }

  updatePotentialHomestayBooking = (field, value) => {
    const { dispatch, potentialBooking } = this.props
    const newPotentialBooking = Object.assign({}, potentialBooking, { [field]: value })
    dispatch(updatePotentialHomestayBooking(newPotentialBooking))
  }

  calculatePrice = overrideCurrency => {
    const { dispatch, token, potentialBooking } = this.props
    console.log(potentialBooking.currency)
    dispatch(calculateHomestayPriceWithinBooking(token, overrideCurrency ? Object.assign({}, potentialBooking, { currency: overrideCurrency }) : potentialBooking))
  }

  changeStep = stepNum => this.setState({ activeStep: stepNum, animationInProgress: true }, () => setTimeout(() => this.setState({ animationInProgress: false }), 300))

  render() {

    const { activeStep, animationInProgress, upsellSearchInitialised } = this.state
    const { user, upsellSearch, homestays, t, token, potentialBooking, potentialBookingHelpers } = this.props

    const currencySymbol = Currencies[potentialBooking.currency]
    const homestay = homestays[potentialBookingHelpers.homeID]
    const room = homestay.data.rooms.filter(r => r.id === potentialBooking.roomId)[0]

    console.log('room: ', room)

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
    const extrasAvailable = homestay.data.pricing.extras.filter(extra => HomeData.homeServices.GENERAL.includes(extra.service))
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

    return (
      <Grid style={styles.grid} ref={node => this.containerNode = node} id='homestay-booking-flow-container'>

        <Helmet title={t('booking.homestay_booking.title')} />

        <div style={styles.contentContainer}>
          <SpinLoader show={upsellSearch.loading || !upsellSearchInitialised}>
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
                                                {extrasAvailable.map(extra => <option key={`service-${extra.service}`} value={extra.service}>{t(`homes.services.${extra.service}`)}</option>)}
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
                                          user={user}
                                          token={token}
                                        />
                                      </Col>
                                    </Row>

                                    <Row>
                                      <Col xs={12}>
                                        <p>{t('booking.charged_notification')}</p>
                                      </Col>
                                    </Row>

                                    Displays payment methods, allowing adding new payment methods

                                </Tab.Pane>

                                  <Tab.Pane eventKey={showUpsell ? 4 : 3}>
                                    General overview, all selected options, total cost
                                    Final "Book now" button
                                  </Tab.Pane>

                                </Tab.Content>
                              </Tab.Container>
                            </Col>
                            <Col xs={12} md={showFullSummary ? 5 : 4} lg={showFullSummary ? 4 : 3} style={styles.widthTransition}>
                              <Sticky
                                isActive={!showFullSummary}
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
                                              <span>{t('common.Dates')}</span><span className='pull-right'>{uiDate(potentialBooking.arrivalDate)} &rarr; {uiDate(potentialBooking.departureDate)}</span>
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
                                        </Col>
                                      </Row>
                                    </div>
                                  </Collapse>
                                  <Row>
                                    <Col xs={12}>
                                      <div>
                                        <strong style={styles.totalPriceLabel}>{t('booking.total_price')}</strong>{!potentialBookingHelpers.price.loading && <span className='pull-right'>{currencySymbol}<span style={styles.totalPrice}>{(totalPrice).toFixed(2)}</span></span>}
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
                    <Pager.Item eventKey={activeStep - 1} previous href='#'>&larr; {t(`booking.homestay_booking.step_${activeStep > 2 && !showUpsell ? activeStep : activeStep - 1}.title`)}</Pager.Item>
                  }
                    {activeStep !== 4 &&
                    <Pager.Item eventKey={activeStep + 1} next href='#'>{t(`booking.homestay_booking.step_${activeStep === 1 && !showUpsell ? activeStep + 2 : activeStep + 1}.title`)} &rarr;</Pager.Item>
                  }
                  </Pager>
                </div>
              }
            </div>
          </SpinLoader>
        </div>

      </Grid>
    )
  }
}

BookingHomestay.propTypes = {
  dispatch: PropTypes.func,
  homestays: PropTypes.object,
  uiCurrency: PropTypes.string,
  user: PropTypes.object,
  upsellSearch: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  potentialBooking: PropTypes.object,
  potentialBookingHelpers: PropTypes.object,
}
