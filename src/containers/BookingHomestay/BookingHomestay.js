// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col, Grid, Tab, Pager, Row, Well } from 'react-bootstrap'
import Helmet from 'react-helmet'
import Steps from 'antd/lib/steps'
import Radium from 'radium'
import { performCourseUpsellSearch } from 'redux/modules/ui/search/courseSearch'
import PaymentMethods from 'components/PaymentMethods/PaymentMethods'
import { SpinLoader } from 'components'
import { translate } from 'react-i18next'

// Relative imports
import styles from './BookingHomestay.styles'


@connect(
  state => ({
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    homestays: state.publicData.homestays,
    user: state.privateData.user.data,
    token: state.auth.token,
    potentialBooking: state.bookings.homestayBookings.potentialBooking,
    potentialBookingHelpers: state.bookings.homestayBookings.potentialBookingHelpers,
  })
)
@translate()
@Radium
export default class ContactUs extends Component {

  state = {
    activeStep: this.props.potentialBookingHelpers.completionStep,
    upsellSearchInitialised: false,
  }

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
    if (!this.state.upsellSearchInitialised && this.props.upsellSearch.loading && nextProps.upsellSearch.loaded) {
      this.setState({ upsellSearchInitialised: true })
    }
  }

  changeStep = stepNum => this.setState({ activeStep: stepNum })

  render() {

    const { activeStep, upsellSearchInitialised } = this.state
    const { user, upsellSearch, t, token, potentialBooking } = this.props

    const showUpsell = upsellSearch.loaded && upsellSearch.data && upsellSearch.data.results && upsellSearch.data.results.length > 0

    return (
      <Grid style={styles.grid} ref={node => this.containerNode = node} id='homestay-booking-flow-container'>

        <Helmet title={t('booking.homestay_booking.title')} />

        <div style={styles.contentContainer}>

          <Row style={styles.h1Row}>
            <Col xs={12}>
              <h1 style={{ textAlign: 'center' }} className='header-green'>{t('booking.homestay_booking.title')}</h1>
            </Col>
          </Row>
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
                      <Well bsSize='large'>
                        <Row>
                          <Col xs={12}>
                            <Tab.Container id='homestay-booking-flow' activeKey={activeStep} onSelect={() => {}}>
                              <Tab.Content>

                                <Tab.Pane eventKey={1}>

                                  <Row>
                                    <Col xs={12}>
                                      <h4>{t('booking.homestay_booking.step_1.title')}</h4>
                                    </Col>
                                  </Row>

                                  <div>
                                    <h6>Immersion</h6>
                                    <div>Dates</div>
                                    <div>Immersion type / Learning Language / Tandem Language (if applicable)</div>
                                    <div>Number of guests</div>
                                  </div>

                                  <div>
                                    <h6>Meal Plan</h6>
                                    <div>Breakfast, Breakfast + Dinner, Breakfast + Lunch + Dinner</div>
                                    <div>Special Diet</div>
                                  </div>

                                  <div>
                                    <h6>Extras</h6>
                                    <div>Laundry, cleaning, airport pickup, etc</div>
                                  </div>

                                </Tab.Pane>

                                {showUpsell &&
                                  <Tab.Pane eventKey={2}>

                                    <Row>
                                      <Col xs={12}>
                                        <h4>{t('booking.homestay_booking.step_2.title')}</h4>
                                      </Col>
                                    </Row>

                                    Shows language course results within 10 kilometers
                                    This step should be hidden if there are no results
                                    Should be an optional "Skip" button at the bottom
                                  </Tab.Pane>
                                }

                                <Tab.Pane eventKey={3}>
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

                                <Tab.Pane eventKey={4}>
                                    General overview, all selected options, total cost
                                    Final "Book now" button
                                  </Tab.Pane>

                              </Tab.Content>
                            </Tab.Container>
                          </Col>
                        </Row>
                      </Well>
                    </Col>
                  </Row>
                  <Pager onSelect={this.changeStep}>
                    {activeStep > 1 &&
                    <Pager.Item eventKey={activeStep - 1} previous href='#'>&larr; {t(`booking.homestay_booking.step_${activeStep - 1}.title`)}</Pager.Item>
                      }
                    {activeStep !== 4 &&
                    <Pager.Item eventKey={activeStep + 1} next href='#'>{t(`booking.homestay_booking.step_${activeStep + 1}.title`)} &rarr;</Pager.Item>
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

ContactUs.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  upsellSearch: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  potentialBooking: PropTypes.object,
  potentialBookingHelpers: PropTypes.object,
}
