// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import config from 'config'
import { connect } from 'react-redux'
import { Col, Grid, Panel, Row } from 'react-bootstrap'
import Currencies from 'data/constants/Currencies'
import FontAwesome from 'react-fontawesome'
import GoogleMap from 'google-map-react'
import Helmet from 'react-helmet'
import { isLoaded, load as loadHomestay, loadRoomCalendar } from 'redux/modules/publicData/homes/loadHome'
import { load as loadUser } from 'redux/modules/publicData/users/loadUser'
import Lightbox from 'react-images'
import LightboxTheme from 'data/constants/LightboxTheme'
import { Link } from 'react-router'
import MapStyles from 'data/constants/MapStyles'
import moment from 'moment'
import { StickyContainer, Sticky } from 'react-sticky'
import { updateRoomSearchParams, updateActiveRoom } from 'redux/modules/ui/search/homestaySearch'
import Radium from 'radium'
import { translate } from 'react-i18next'

// Relative imports
import BookNow from './subcomponents/BookNow'
import HomestayReviews from './subcomponents/HomestayReviews'
import styles from './Homestay.styles'
import MapCircle from './subcomponents/MapCircle'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const result = !isLoaded(getState(), params.homeID) ? dispatch(loadHomestay(params.homeID)) : null
    return __CLIENT__ ? null : result

  },
}])
@connect(
  (state, ownProps) => ({
    activeRoom: state.uiPersist.homestaySearch.activeRoom,
    debug: ownProps,
    homestay: state.publicData.homestays[ownProps.params.homeID],
    homestaySearch: state.uiPersist.homestaySearch,
    host: state.publicData.homestays[ownProps.params.homeID] && state.publicData.homestays[ownProps.params.homeID].data && state.publicData.users[state.publicData.homestays[ownProps.params.homeID].data.host.userId] ? state.publicData.users[state.publicData.homestays[ownProps.params.homeID].data.host.userId] : null, // eslint-disable-line
    error: state.publicData.homestays.error,
    loading: state.publicData.homestays.loading,
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
@Radium
export default class Homestay extends Component {

  state = {
    activeRoom: {},
    lightboxOpen: false,
    lightboxImage: 0,
    roomSelectionOpen: false,
  }

  componentDidUpdate = () => {

    // Initialisation steps
    const { activeRoom, dispatch, homestay } = this.props

    if (homestay.loaded && !homestay.roomCalendars[activeRoom] && !homestay.roomCalendars.loading) {

      // If there is no activeRoom, or if activeRoom belongs to another home, set new one
      if (!activeRoom || homestay.data.rooms.filter(room => room.id === activeRoom).length === 0) {
        dispatch(updateActiveRoom(homestay.data.rooms[0].id))
        this.fetchRoomCalendar(homestay.data.rooms[0].id, this.determineCalendarConflict)
      } else {
        this.fetchRoomCalendar(activeRoom, this.determineCalendarConflict)
      }

    } else if (homestay.roomCalendars[activeRoom] && !homestay.roomCalendars.loading) {

      try {
        this.determineCalendarConflict()
      } catch (err) {
        console.log('Unable to determine conflicts', err)
      }

    }


  }

  determineCalendarConflict = () => {

    // Check for conflicts (possible to select dates with one room, and then switch
    // to a room who has those dates blocked)
    const { activeRoom, dispatch, homestay, homestaySearch } = this.props

    if (homestaySearch.params.arrival && homestaySearch.params.departure) {

      homestay.roomCalendars[activeRoom].data.unavailabilities.some(blocked => {

        const blockedRange = moment.range(blocked.start, blocked.end)
        const dateRage = moment.range(homestaySearch.params.arrival, homestaySearch.params.departure)

        if (dateRage.overlaps(blockedRange)) {
          dispatch(updateRoomSearchParams(Object.assign({}, homestaySearch.params, {
            arrival: null,
            departure: null,
          })))
        }

      })
    }

  }

  fetchHostInfo = () => this.props.dispatch(loadUser(this.props.homestay.data.host.userId))

  fetchRoomCalendar = (roomID, callback) => {
    const { dispatch, homestay } = this.props
    dispatch(loadRoomCalendar(homestay.data.id, roomID, callback))
  }

  handleRoomDropdownChange = value => this.setState({ roomSelectionOpen: value })

  // Lightbox functions
  openLightbox = () => this.setState({ lightboxOpen: true })
  closeLightbox = () => this.setState({ lightboxOpen: false })
  goToPrevImage = () => this.setState({ lightboxImage: this.state.lightboxImage - 1 })
  goToNextImage = () => this.setState({ lightboxImage: this.state.lightboxImage + 1 })
  goToImage = index => this.setState({ lightboxImage: index })

  render() {

    const { lightboxOpen, lightboxImage } = this.state
    const { activeRoom, error, homestay, host, loading, uiCurrency, t } = this.props

    const activeRoomObj = homestay.data && activeRoom ? homestay.data.rooms.filter(room => room.id === activeRoom)[0] : {}
    const currencySymbol = Currencies[uiCurrency]

    // Determine weekly rates
    let stayRate = null
    let tandemRate = null
    let teacherRate = null

    if (homestay.data) {
      if (homestay.data.immersions.stay && homestay.data.immersions.stay.isActive) {
        stayRate = Math.ceil(activeRoomObj.price)
      }

      if (homestay.data.immersions.tandem && homestay.data.immersions.tandem.isActive) {
        tandemRate = Math.ceil(activeRoomObj.price * ((100 - homestay.data.immersions.tandem.languagesInterested[0].discount) / 100))
      }

      if (homestay.data.immersions.teacher && homestay.data.immersions.teacher.isActive) {
        teacherRate = Math.ceil((activeRoomObj.price + (homestay.data.immersions.teacher.hourly * homestay.data.immersions.teacher.packages[0])))
      }
    }

    return (
      <div style={{ marginBottom: -20 }}>

        {!error && !loading && homestay && homestay.data &&

          <Grid style={styles.grid}>

            {homestay.data.basics.family ?
              <Helmet title={t('homes.family_home_title', { host: homestay.data.host.firstName })} />
              :
              <Helmet title={t('homes.non_family_home_title', { host: homestay.data.host.firstName })} />
            }

            <div style={styles.bg} />

            <StickyContainer>
              <Row>
                <Col xs={12} style={styles.heroContainer}>
                  <div style={styles.diagonal} />
                  <div
                    onClick={this.openLightbox}
                    style={Object.assign({}, styles.heroImage, { backgroundImage: `url(${config.img}${homestay.data.images[0].imagePath})` })}
                  />
                  {homestay.data.host.photo &&
                    <div style={Object.assign({}, styles.hostImage, { backgroundImage: `url(${config.img}${homestay.data.host.photo})` })} />
                }
                  <Lightbox
                    backdropClosesModal
                    currentImage={lightboxImage}
                    images={homestay.data.images.map(image => ({ src: `${config.img}${image.imagePath}`, caption: image.caption }))}
                    onClose={this.closeLightbox}
                    onClickNext={this.goToNextImage}
                    onClickPrev={this.goToPrevImage}
                    onClickThumbnail={this.goToImage}
                    isOpen={lightboxOpen}
                    showThumbnails
                    theme={LightboxTheme}
                  />
                </Col>
              </Row>
              <div style={styles.contentContainer}>
                <Row style={styles.borderBottom}>
                  <Col xs={12}>
                    <h1>
                      {homestay.data.basics.family ?
                        <span>{t('homes.family_home_title', { host: homestay.data.host.firstName })}</span>
                        :
                        <span>{t('homes.non_family_home_title', { host: homestay.data.host.firstName })}</span>
                      }
                      <br />
                      <span style={styles.pageSubtitle} className='text-muted'>
                        {t(`homes.home_types.${homestay.data.basics.homeType}`)} / {homestay.data.location.city}
                      </span>
                    </h1>
                  </Col>
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12}>
                    <h4>{t('common.About')}</h4>
                    <p>{homestay.data.description.summary}</p>
                  </Col>
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12} md={6}>
                    <h4>{t('common.Languages')}</h4>
                    {homestay.data.host.languagesLearning.length > 0 &&
                      <p>
                        <strong>{t('common.Learning')}: </strong>
                        {homestay.data.host.languagesLearning.map(language => <span key={`learn-${language.language}`}>{t(`languages.${language.language}`)} ({t(`common.${language.level}`)}){homestay.data.host.languagesLearning.indexOf(language) !== homestay.data.host.languagesLearning.length - 1 ?
                          <span>,&nbsp;</span> : null}</span>)}
                      </p>
                    }
                    <p>
                      <strong>{t('common.Speaks')}: </strong>
                      {homestay.data.host.languagesKnown.map(language => <span key={`speak-${language.language}`}>{t(`languages.${language.language}`)} ({t(`common.${language.level}`)}){homestay.data.host.languagesKnown.indexOf(language) !== homestay.data.host.languagesKnown.length - 1 ?
                        <span>,&nbsp;</span> : null}</span>)}
                    </p>
                    {homestay.data.immersions.teacher && homestay.data.immersions.teacher.isActive &&
                      <p>
                        <strong>{t('homes.teaches')}: </strong>
                        {homestay.data.immersions.teacher.languagesOffered.map(language => <span key={`teach-${language}`}>{t(`languages.${language}`)}{homestay.data.immersions.teacher.languagesOffered.indexOf(language) !== homestay.data.immersions.teacher.languagesOffered.length - 1 ?
                          <span>,&nbsp;</span> : null}</span>)}
                      </p>
                    }
                  </Col>
                  <Col xs={12} md={6}>
                    <h4>{t('common.host')}</h4>
                    <p>
                      <strong>{t('common.First_name')}: </strong>{homestay.data.host.firstName}
                    </p>
                    <p>
                      <strong>{t('common.age')}: </strong>{homestay.data.host.age} {homestay.data.host.gender ? <span>({t(`users.genders.${homestay.data.host.gender}`)})</span> : null}
                    </p>
                    <p>
                      <strong>{t('common.Location')}: </strong>{homestay.data.location.city}, {t(`countries.${homestay.data.location.country}`)}
                    </p>
                    {!host &&
                      <p>
                        <a onClick={this.fetchHostInfo}>{t('common.words.more')}</a>
                      </p>
                    }
                    {host && host.interests.length > 0 &&
                      <p>
                        <strong>{t('common.Interests')}:</strong> {host.interests.map(interest => <span key={`host-interest-${interest}`}>{t(`interests.${interest}`)}{host.interests.indexOf(interest) !== host.interests.length - 1 ? <span>, &nbsp;</span> : null}</span>)}
                      </p>
                    }
                    {host && host.education &&
                      <p>
                        <strong>{t('common.Education')}:</strong> {host.education}
                      </p>
                    }
                    {host && host.favouriteBooks &&
                      <p>
                        <strong>{t('common.Favourite_book')}:</strong> {host.favouriteBooks}
                      </p>
                    }
                    {host && host.favouriteFilms &&
                      <p>
                        <strong>{t('common.Favourite_film')}:</strong> {host.favouriteFilms}
                      </p>
                    }
                    {host &&
                      <p>
                        <strong>Joined:</strong> {t(`common.months.m${host.joinedMonth}`)}, {host.joinedYear}
                      </p>
                    }
                    {host &&
                      <p>
                        <Link to={`/user/${homestay.data.host.userId}`}>
                          {t('homes.more_about_host', { host: homestay.data.host.firstName })}
                        </Link>
                      </p>
                    }
                  </Col>
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12}>
                    <h4>{t('common.the_room')}</h4>
                    {activeRoom &&
                      <Panel header={<h6 className='header-green'>{activeRoomObj.name}</h6>} style={styles.noBoxShadow}>
                        <Row>
                          <Col xs={12} md={4}>
                            <div style={styles.roomImageContainer}>
                              {activeRoomObj.image ?
                                <div style={Object.assign({}, styles.roomImage, { backgroundImage: `url(${config.img}${activeRoomObj.image})` })} />
                                :
                                <FontAwesome name='bed' style={styles.bedIcon} />
                              }
                            </div>
                          </Col>
                          <Col xs={12} md={8}>
                            <p>
                              <strong>{t('manage_home.pricing_room_rates')}: </strong>
                              {stayRate &&
                                <span className='immersion-tag large'>{t('immersions.stay')}: {currencySymbol}{stayRate}</span>
                              }
                              {tandemRate &&
                                <span className='immersion-tag large'>{t('immersions.tandem')}: {currencySymbol}{tandemRate}</span>
                              }
                              {teacherRate &&
                                <span className='immersion-tag large'>{t('immersions.teachers_stay')}: {currencySymbol}{teacherRate}</span>
                              }
                            </p>
                          </Col>
                          <Col xs={12} md={8}>
                            <p>
                              <strong>{t('common.Bed_type')}:</strong> {t(`homes.bed_types.${activeRoomObj.bedType}`)}
                            </p>
                          </Col>
                          <Col xs={12} md={8}>
                            <p>
                              <strong>{t('common.Sleeps')}:</strong> {activeRoomObj.vacancies}
                            </p>
                          </Col>
                          <Col xs={12} md={8}>
                            <p>
                              <strong>{t('common.Shared')}:</strong> {activeRoomObj.isShared ? <span>{t('common.words.Yes')}</span> : <span>{t('common.words.No')}</span>}
                            </p>
                          </Col>
                          {activeRoomObj.roomFacilities.length > 0 &&
                            <Col xs={12} md={8}>
                              <p>
                                <strong>{t('common.Facilities')}:</strong>&nbsp;
                                {activeRoomObj.roomFacilities.map(facility => <span key={`room-fac-${facility}`}>{t(`homes.facilities.${facility}`)}{activeRoomObj.roomFacilities.indexOf(facility) !== activeRoomObj.roomFacilities.length - 1 ? <span>,&nbsp;</span> : null}</span>)}
                              </p>
                            </Col>
                          }
                          <Col xs={12} md={8}>
                            <p>
                              <strong>{t('common.Room_description')}:</strong> {activeRoomObj.description ? <span>{activeRoomObj.description}</span> : <span>{t('homes.no_description')}</span>}
                            </p>
                          </Col>
                        </Row>
                      </Panel>
                    }
                  </Col>
                  {homestay.data.rooms.length > 1 &&
                    <Col xs={12}>
                      <a onClick={() => this.handleRoomDropdownChange(true)}><small>{t('homes.more_rooms')}</small></a>
                    </Col>
                  }
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12}>
                    <h4 style={{ textTransform: 'capitalize' }}>{t('common.Home_info')}</h4>
                  </Col>
                  {homestay.data.basics.AMENITIES.length > 0 &&
                    <span>
                      <Col sm={12} md={3}>
                        <p>
                          <strong>{t('common.Amenities')}: </strong>
                        </p>
                      </Col>
                      <Col sm={12} md={9}>
                        <p>
                          {homestay.data.basics.AMENITIES.map(amenity => <span key={`home-amenity-${amenity}`}>{t(`homes.amenities.${amenity}`)}{homestay.data.basics.AMENITIES.indexOf(amenity) !== homestay.data.basics.AMENITIES.length - 1 ? <span>,&nbsp;</span> : null}</span>)}
                        </p>
                      </Col>
                    </span>
                  }
                  {homestay.data.basics.EXTRAS.length > 0 &&
                    <span>
                      <Col sm={12} md={3}>
                        <p>
                          <strong>{t('homes.extras_label')}: </strong>
                        </p>
                      </Col>
                      <Col sm={12} md={9}>
                        <p>
                          {homestay.data.basics.EXTRAS.map(extra => <span key={`home-extra-${extra}`}>{t(`homes.extras.${extra}`)}{homestay.data.basics.EXTRAS.indexOf(extra) !== homestay.data.basics.EXTRAS.length - 1 ? <span>,&nbsp;</span> : null}</span>)}
                        </p>
                      </Col>
                    </span>
                  }
                  {homestay.data.basics.FOOD_OPTION.length > 0 &&
                    <span>
                      <Col sm={12} md={3}>
                        <p>
                          <strong>{t('homes.diets_offered_label')}: </strong>
                        </p>
                      </Col>
                      <Col sm={12} md={9}>
                        <p>
                          {homestay.data.basics.FOOD_OPTION.map(foodOption => <span key={`home-food-${foodOption}`}>{t(`homes.diets_offered.${foodOption}`)}{homestay.data.basics.FOOD_OPTION.indexOf(foodOption) !== homestay.data.basics.FOOD_OPTION.length - 1 ? <span>,&nbsp;</span> : null}</span>)}
                        </p>
                      </Col>
                    </span>
                  }
                  {homestay.data.pricing.extras.length > 0 &&
                    <span>
                      <Col sm={12} md={3}>
                        <p>
                          <strong>{t('common.available_for_additional_fee')}: </strong>
                        </p>
                      </Col>
                      <Col sm={12} md={9}>
                        <p>
                          {homestay.data.pricing.extras.map(extra => {
                            return (
                              <span key={`home-extra-cost-${extra.service}`}>{t(`homes.services.${extra.service}`)}&nbsp;({currencySymbol}{extra.cost}){homestay.data.pricing.extras.indexOf(extra) !== homestay.data.pricing.extras.length - 1 ? <span>,&nbsp;</span> : null}</span>) }
                            )
                          }
                        </p>
                      </Col>
                    </span>
                  }
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12}>
                    <h4>{t('common.Reviews')}</h4>
                    <HomestayReviews reviewInfo={homestay.data.reviewInfo} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <h4>{t('common.Location')}</h4>
                    <div style={styles.mapContainer}>
                      <GoogleMap
                        center={[homestay.data.location.lat, homestay.data.location.lng]}
                        zoom={14}
                        options={() => ({
                          panControl: false,
                          mapTypeControl: false,
                          scrollwheel: false,
                          styles: MapStyles,
                        })}
                      >
                        <MapCircle lat={homestay.data.location.lat} lng={homestay.data.location.lng} />
                      </GoogleMap>
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={styles.stickyContainer}>
                <Sticky
                  topOffset={-100}
                  stickyStyle={{ paddingTop: 100 }}
                >
                  <div>
                    <Panel style={styles.panel}>
                      <BookNow
                        immersionRates={{ stayRate, tandemRate, teacherRate }}
                        currencySymbol={currencySymbol}
                        determineCalendarConflict={this.determineCalendarConflict}
                        handleRoomDropdownChange={this.handleRoomDropdownChange}
                        homeID={parseInt(this.props.params.homeID)}
                        roomSelectionOpen={this.state.roomSelectionOpen}
                      />
                    </Panel>
                    <Row style={{ marginBottom: 40 }}>
                      <Col xs={12}>
                        <div style={styles.pricingDisclaimer}>*{t('common.homestay_pricing_disclaimer')}</div>
                      </Col>
                    </Row>
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

Homestay.propTypes = {
  activeRoom: PropTypes.number,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  homestay: PropTypes.object,
  homestaySearch: PropTypes.object,
  host: PropTypes.object,
  loading: PropTypes.bool,
  uiCurrency: PropTypes.string,
  params: PropTypes.object,
  t: PropTypes.func,
}
