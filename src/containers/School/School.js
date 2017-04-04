// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { BackgroundImage, MapPin } from 'components'
import { Badge, Col, Grid, Nav, NavItem, Panel, Tab, Row, Well } from 'react-bootstrap'
import config from 'config'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import GoogleMap from 'google-map-react'
import Helmet from 'react-helmet'
import { isLoaded, load as loadEducator, loadEducatorCity } from 'redux/modules/publicData/educators/loadEducator'
import MapStyles from 'data/constants/MapStyles'
import moment from 'moment'
import Radium from 'radium'
import { StickyContainer, Sticky } from 'react-sticky'
import { updateActiveCourse } from 'redux/modules/ui/search/courseSearch'
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

      // First load educator by ID
      promises.push(dispatch(loadEducator(params.educatorID)).then(educator => {

        // Then load city by coordinates
        return dispatch(loadEducatorCity({ lat: educator.address.lat, lng: educator.address.lng }, params.educatorID))

      }))

    }

    return Promise.all(promises)

  },
}])
@connect(
  (state, ownProps) => ({
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

  componentWillMount = () => {

    const { courseSearch, dispatch, educator } = this.props

    // If there is no active course, or if it belongs to another school, we need to reset
    if (!courseSearch.activeCourse || !educator.courses.some(course => course.id === courseSearch.activeCourse)) {
      dispatch(updateActiveCourse(educator.courses[0].id))
    }

  }

  render() {

    const { educator, t, uiCurrency } = this.props

    const currencySymbol = Currencies[uiCurrency]
    const stickied = typeof window !== 'undefined' ? window.innerWidth > 767 : true

    console.log(this)

    const filteredCourses = educator.courses.filter(course => {

      // Non recurring courses in the past are literally unbookable and should not be shown
      return (course.recurrenceType || (course.recurrenceType === null && moment().isBefore(moment(course.startDate).add(course.numberOfWeeks, 'weeks'))))

    })

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
                  <h1>{educator.schoolName} <Badge style={styles.badge}>{t(`course_cities.${educator.city}.name`)}</Badge><Badge style={styles.badge}>{t(`languages.${educator.offeredLanguages[0]}`)}</Badge></h1>
                </Col>
                <Col xs={12} sm={5} md={4} lg={3}>
                  <div
                    className='hidden-xs'
                    style={Object.assign({}, styles.educatorMainImg, { backgroundImage: `url(${config.img}${educator.image}?w=200)` })}
                  />
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
                          <Col xs={12}>
                            <p>{educator.description}</p>
                          </Col>
                        </Row>
                        <Well>
                          <Row>
                            {educator.schoolSize &&
                            <span>
                              <Col sm={12} md={4}>
                                <p>
                                  <strong>{t('schools.school_size')}: </strong>
                                </p>
                              </Col>
                              <Col sm={12} md={8}>
                                <p>{t(`schools.sizes.${educator.schoolSize}`)}</p>
                              </Col>
                            </span>
                                }
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
                            {educator.websiteLink &&
                            <span>
                              <Col sm={12} md={4}>
                                <p>
                                  <strong>{t('schools.website')}: </strong>
                                </p>
                              </Col>
                              <Col sm={12} md={8}>
                                <p><a href={educator.websiteLink}>{educator.websiteLink}</a></p>
                              </Col>
                            </span>
                                }
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
                        </Well>
                        <Row>
                          <Col xs={12}>
                            <div style={styles.mapContainer}>
                              <GoogleMap
                                center={[educator.address.lat, educator.address.lng]}
                                zoom={16}
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
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12}>
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
                        {educator.courses &&
                        <span>
                          {filteredCourses.map(course => <Course key={course.id} result={course} educatorName={educator.schoolName} />)}
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
                      courses={filteredCourses}
                      currencySymbol={currencySymbol}
                      educatorID={parseInt(this.props.params.educatorID)}
                    />
                  </Panel>
                </div>
              </Sticky>
            </div>
          </StickyContainer>
          <div style={styles.pageBottomColourBlock} />
        </Grid>
        }
      </div>
    )
  }
}

School.propTypes = {
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
