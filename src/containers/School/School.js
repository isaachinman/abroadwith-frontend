// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Nav, NavItem, Panel, Tab, Row } from 'react-bootstrap'
import { asyncConnect } from 'redux-connect'
import { BackgroundImage } from 'components'
// import config from 'config'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
// import GoogleMap from 'google-map-react'
import Helmet from 'react-helmet'
import { isLoaded, load as loadEducator, loadEducatorCity } from 'redux/modules/publicData/educators/loadEducator'
// import { load as loadUser } from 'redux/modules/publicData/users/loadUser'
// import Lightbox from 'react-images'
// import LightboxTheme from 'data/constants/LightboxTheme'
// import { Link } from 'react-router'
// import MapStyles from 'data/constants/MapStyles'
// import shallowCompare from 'react-addons-shallow-compare'
// import SendNewMessageToHost from 'components/SendNewMessageToHost/SendNewMessageToHost'
// import { StickyContainer, Sticky } from 'react-sticky'
// import { updateActiveCourse } from 'redux/modules/ui/search/courseSearch'
import Radium from 'radium'
import { StickyContainer, Sticky } from 'react-sticky'
import { translate } from 'react-i18next'

// Relative imports
import BookNow from './subcomponents/BookNow'
// import HomestayReviews from './subcomponents/HomestayReviews'
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
                          <h6 style={styles.tabTitle}>The School</h6>
                        </NavItem>
                        <NavItem eventKey='city'>
                          <h6 style={styles.tabTitle}>The City</h6>
                        </NavItem>
                        <NavItem eventKey='reviews'>
                          <h6 style={styles.tabTitle}>Reviews</h6>
                        </NavItem>
                        <NavItem eventKey='courses'>
                          <h6 style={styles.tabTitle}>Courses</h6>
                        </NavItem>
                      </Nav>
                    </Col>
                    <Col sm={12}>
                      <Tab.Content animation style={styles.tabContentContainer}>
                        <Tab.Pane eventKey='school'>
                          <Row>
                            <Col xs={12}>
                              {educator.image &&
                                <BackgroundImage
                                  src={educator.image}
                                  maxWidth={800}
                                  styles={styles.educatorMainImg}
                                />
                              }
                              <p>{educator.description}</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={12} md={4}>
                              <p>
                                <strong>Languages offered: </strong>
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
                                  <strong>Website: </strong>
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
                                <strong>Address: </strong>
                              </p>
                            </Col>
                            <Col sm={12} md={8}>
                              <p>
                                {educator.address.street}, {educator.address.city}<br />{educator.address.zipCode && <span>{educator.address.zipCode},</span>} {t(`countries.${educator.address.country}`)}
                              </p>
                            </Col>
                          </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey='city'>
                          City content
                        </Tab.Pane>
                        <Tab.Pane eventKey='reviews'>
                          Review content
                        </Tab.Pane>
                        <Tab.Pane eventKey='courses'>
                          Courses content
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
