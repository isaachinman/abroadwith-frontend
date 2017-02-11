// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col, Grid, Tab, Pager, Row, Well } from 'react-bootstrap'
import Helmet from 'react-helmet'
import Steps from 'antd/lib/steps'
import Radium from 'radium'
import { performCourseUpsellSearch } from 'redux/modules/ui/search/courseSearch'
import { SpinLoader } from 'components'
import { translate } from 'react-i18next'

// Relative imports
import styles from './BookingHomestay.styles'


@connect(
  state => ({
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    homestays: state.publicData.homestays,
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

  changeStep = stepNum => this.setState({ activeStep: stepNum })

  render() {

    const { activeStep } = this.state
    const { upsellSearch, t, potentialBookingHelpers } = this.props

    const { completionStep } = potentialBookingHelpers

    const showUpsell = potentialBookingHelpers.immersionType !== 'teacher' && upsellSearch.loaded && upsellSearch.data && upsellSearch.data.results && upsellSearch.data.results.length > 0

    return (
      <Grid style={styles.grid} ref={node => this.containerNode = node}>

        <Helmet title={t('booking.homestay_booking.title')} />

        <div style={styles.bg} />

        <div style={styles.contentContainer}>
          <Row>
            <Col xs={12}>
              <h1>{t('booking.homestay_booking.title')}</h1>
            </Col>
          </Row>
          <SpinLoader show={upsellSearch.loading}>
            <span>
              <Row>
                <Col xs={12}>
                  <Steps current={activeStep - 1/* No idea why, but antdesign zero indexed this component */}>
                    <Steps.Step title={t('booking.homestay_booking.step_1.title')} description={t('booking.homestay_booking.step_1.subtitle')} />
                    {showUpsell && <Steps.Step title={t('booking.homestay_booking.step_2.title')} description={t('booking.homestay_booking.step_2.subtitle')} />}
                    <Steps.Step title={t('booking.homestay_booking.step_3.title')} description={t('booking.homestay_booking.step_3.subtitle')} />
                    <Steps.Step title={t('booking.homestay_booking.step_4.title')} description={t('booking.homestay_booking.step_4.subtitle')} />
                  </Steps>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Well>
                    <Row>
                      <Col xs={12}>
                        <Tab.Container id='homestay-booking-flow' activeKey={activeStep} onSelect={() => {}}>
                          <Tab.Content>

                            <Tab.Pane eventKey={1}>
                              Not editable: dates

                              Editable: meal plan, diet restrictions, hours per week, teacher package, extra services
                            </Tab.Pane>

                            {showUpsell &&
                              <Tab.Pane eventKey={2}>
                                Shows language course results within 10 kilometers
                                This step should be hidden if there are no results
                                Should be an optional "Skip" button at the bottom
                              </Tab.Pane>
                            }

                            <Tab.Pane eventKey={3}>
                              Displays payment methods, allowing adding new payment methods

                              "You'll only be charged if your request is accepted by the host. They'll have 48 hours to accept or decline."
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
              <Row>
                <Col xs={12}>
                  <Pager onSelect={this.changeStep}>
                    {activeStep > 1 && completionStep > activeStep &&
                      <Pager.Item eventKey={activeStep - 1} previous href='#'>&larr; {t('common.previous')}</Pager.Item>
                    }
                    {activeStep < 4 && completionStep > activeStep &&
                      <Pager.Item disabled={activeStep >= 4} eventKey={activeStep + 1} next href='#'>{t('common.next')} &rarr;</Pager.Item>
                    }
                  </Pager>
                </Col>
              </Row>
            </span>
          </SpinLoader>
        </div>

      </Grid>
    )
  }
}

ContactUs.propTypes = {
  dispatch: PropTypes.func,
  upsellSearch: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
  potentialBooking: PropTypes.object,
  potentialBookingHelpers: PropTypes.object,
}
