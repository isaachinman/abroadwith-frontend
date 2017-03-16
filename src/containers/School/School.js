// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Nav, NavItem, Panel, Tab, Row } from 'react-bootstrap'
import { asyncConnect } from 'redux-connect'
import { BackgroundImage, MapPin } from 'components'
// import config from 'config'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import GoogleMap from 'google-map-react'
import Helmet from 'react-helmet'
import { isLoaded, load as loadEducator, loadEducatorCourses, loadEducatorCity } from 'redux/modules/publicData/educators/loadEducator'
import MapStyles from 'data/constants/MapStyles'
import Radium from 'radium'
import { StickyContainer, Sticky } from 'react-sticky'
import { translate } from 'react-i18next'

// Relative imports
import BookNow from './subcomponents/BookNow'
import Course from './subcomponents/Course'
import SchoolReviews from './subcomponents/SchoolReviews'
import styles from './School.styles'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const promises = []

    if (!isLoaded(getState(), params.educatorID)) {
      promises.push(dispatch(loadEducator(params.educatorID)))
    }

    return Promise.all(promises)

  },
}])
@connect(
  (state, ownProps) => ({
    activeCourse: state.uiPersist.courseSearch.activeCourse,
    error: state.publicData.educators.error,
    educator: state.publicData.educators[ownProps.params.educatorID],
    courseSearch: state.uiPersist.courseSearch,
    loading: state.publicData.educators.loading,
    token: state.auth.token || null,
    uiCurrency: state.ui.currency.value,
    currencyRates: state.ui.currency.exchangeRates.data.rates,
  })
)
@translate()
@Radium
export default class School extends Component {

  componentDidMount = () => {
    const { dispatch, educator } = this.props
    dispatch(loadEducatorCity({ lat: educator.address.lat, lng: educator.address.lng }, educator.id))
    dispatch(loadEducatorCourses(educator.id))
  }

  render() {

    console.log(this)

    const { educator, t, uiCurrency } = this.props

    const currencySymbol = Currencies[uiCurrency]
    const stickied = typeof window !== 'undefined' ? window.innerWidth > 767 : true

    return (
      <div style={{ marginBottom: -20 }}>

        {educator && educator.id &&

          <Grid style={styles.grid}>

            <Helmet title={educator.schoolName} />

            <div style={styles.bg} />

            <StickyContainer>
              <div className='school-profile-page-header'>
                <Row style={styles.headerRow}>
                  <Col xs={12} sm={7} md={8} lg={9}>
                    <h1>{educator.schoolName}</h1>
                  </Col>
                </Row>
              </div>
              <div style={styles.contentContainer}>
                <Tab.Container id='school-profile-page-tabs' defaultActiveKey='school'>
                  <Row className='clearfix'>
                    <Col sm={12}>
                      <Nav bsStyle='tabs'>

                        <NavItem eventKey='school'>
                          <h6 style={styles.tabTitle}>{t('schools.tabs.school')}</h6>
                        </NavItem>

                        <NavItem eventKey='city'>
                          <h6 style={styles.tabTitle}>{t('schools.tabs.city')}</h6>
                        </NavItem>

                        {educator.educatorReviews.length > 0 &&
                          <NavItem eventKey='reviews'>
                            <h6 style={styles.tabTitle}>{t('schools.tabs.reviews')}</h6>
                          </NavItem>
                        }

                        <NavItem eventKey='courses'>
                          <h6 style={styles.tabTitle}>{t('schools.tabs.courses')}</h6>
                        </NavItem>

                      </Nav>
                    </Col>
                    <Col sm={12}>
                      <Tab.Content animation style={styles.tabContentContainer}>

                        {/* School info tab */}
                        <Tab.Pane eventKey='school'>
                          <Row>
                            {educator.image ?
                              <span>
                                <Col xs={12} md={4}>
                                  <BackgroundImage
                                    src={educator.image}
                                    maxWidth={500}
                                    styles={styles.educatorMainImg}
                                  />
                                </Col>
                                <Col xs={12} md={8}>
                                  <p>{educator.description}</p>
                                </Col>
                              </span>
                              :
                              <Col xs={12}>
                                <p>{educator.description}</p>
                              </Col>
                            }
                          </Row>
                          <Row>
                            <Col sm={12} md={4}>
                              <p>
                                <strong>{t('schools.languages_offered')}: </strong>
                              </p>
                            </Col>
                            <Col sm={12} md={8}>
                              <p>
                                {educator.offeredLanguages.map(lang => {
                                  return (
                                    <span key={`offered-lang-${lang}`}>{t(`languages.${lang}`)}{educator.offeredLanguages.indexOf(lang) !== educator.offeredLanguages.length - 1 ? <span>,&nbsp;</span> : null}</span>
                                  )
                                })}
                              </p>
                            </Col>
                          </Row>
                          {educator.websiteLink &&
                            <Row>
                              <Col sm={12} md={4}>
                                <p>
                                  <strong>{t('schools.website')}: </strong>
                                </p>
                              </Col>
                              <Col sm={12} md={8}>
                                <p><a href={educator.websiteLink}>{educator.websiteLink}</a></p>
                              </Col>
                            </Row>
                          }
                          <Row>
                            <Col sm={12} md={4}>
                              <p>
                                <strong>{t('schools.address')}: </strong>
                              </p>
                            </Col>
                            <Col sm={12} md={8}>
                              <p>
                                {educator.address.street}, {educator.address.city}<br />{educator.address.zipCode && <span>{educator.address.zipCode},</span>} {t(`countries.${educator.address.country}`)}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12}>
                              <div style={styles.mapContainer}>
                                <GoogleMap
                                  center={[educator.address.lat, educator.address.lng]}
                                  zoom={14}
                                  options={() => ({
                                    panControl: false,
                                    mapTypeControl: false,
                                    scrollwheel: false,
                                    styles: MapStyles,
                                  })}
                                >
                                  <MapPin lat={educator.address.lat} lng={educator.address.lng} />
                                </GoogleMap>
                              </div>
                            </Col>
                          </Row>
                        </Tab.Pane>

                        {/* City tab */}
                        <Tab.Pane eventKey='city'>
                          {educator.city &&
                            <span>
                              <Row>
                                <Col xs={12}>
                                  <h4>{t(`course_cities.${educator.city}.name`)}</h4>
                                  <BackgroundImage
                                    src={t(`course_cities.${educator.city}.image`)}
                                    maxWidth={800}
                                    styles={styles.cityImg}
                                  />
                                  <p>{t(`course_cities.${educator.city}.description`)}</p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <h6>{t('schools.language')}</h6>
                                  <p>{t(`course_cities.${educator.city}.language`)}</p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <h6>{t('schools.culture')}</h6>
                                  <p>{t(`course_cities.${educator.city}.culture`)}</p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <h6>{t('schools.nightlife')}</h6>
                                  <p>{t(`course_cities.${educator.city}.nightlife`)}</p>
                                </Col>
                              </Row>
                            </span>
                          }
                        </Tab.Pane>

                        {/* Reviews tab */}
                        {educator.educatorReviews.length > 0 &&
                          <Tab.Pane eventKey='reviews'>
                            <SchoolReviews reviews={educator.educatorReviews} />
                          </Tab.Pane>
                        }

                        {/* Courses tab */}
                        <Tab.Pane eventKey='courses'>
                          {educator.courses.loaded &&
                            <span>
                              {educator.courses.data.map(course => <Course key={course.courseId} result={course} />)}
                            </span>
                          }
                        </Tab.Pane>

                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
              <div style={styles.stickyContainer}>
                <Sticky
                  isActive={stickied}
                  topOffset={-100}
                  stickyStyle={{ paddingTop: 100 }}
                >
                  <div>
                    <Panel style={styles.panel}>
                      <BookNow
                        currencySymbol={currencySymbol}
                        determineCalendarConflict={this.determineCalendarConflict}
                        handleRoomDropdownChange={this.handleRoomDropdownChange}
                        homeID={parseInt(this.props.params.homeID)}
                        roomSelectionOpen={this.state.roomSelectionOpen}
                      />
                    </Panel>
                  </div>
                </Sticky>
              </div>
            </StickyContainer>
          </Grid>

        }

      </div>
    )
  }
}

School.propTypes = {
  activeCourse: PropTypes.number,
  currencyRates: PropTypes.object,
  dispatch: PropTypes.func,
  educator: PropTypes.object,
  error: PropTypes.object,
  courseSearch: PropTypes.object,
  host: PropTypes.object,
  loading: PropTypes.bool,
  newThread: PropTypes.object,
  uiCurrency: PropTypes.string,
  params: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
