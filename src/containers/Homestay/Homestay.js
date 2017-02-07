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
import { translate } from 'react-i18next'

// Relative imports
import BookNow from './subcomponents/BookNow'
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
        stayRate = activeRoomObj.price
      }

      if (homestay.data.immersions.tandem && homestay.data.immersions.tandem.isActive) {
        tandemRate = Math.ceil(activeRoomObj.price * ((100 - homestay.data.immersions.tandem.languagesInterested[0].discount) / 100))
      }

      if (homestay.data.immersions.teacher && homestay.data.immersions.teacher.isActive) {
        teacherRate = Math.ceil((activeRoomObj.price + (homestay.data.immersions.teacher.hourly * homestay.data.immersions.teacher.packages[0])))
      }
    }

    // Determine cheapest weekly rate
    const cheapestWeeklyRate = Math.min.apply(null, [stayRate, tandemRate, teacherRate].filter(rate => rate))

    console.log(this)

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
                      <small>
                        {t(`homes.home_types.${homestay.data.basics.homeType}`)} / {homestay.data.location.city}
                      </small>
                    </h1>
                  </Col>
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12}>
                    <h5>{t('common.About')}</h5>
                    <p>{homestay.data.description.summary}</p>
                  </Col>
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12} md={6}>
                    <h5>{t('common.Languages')}</h5>
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
                    <h5>{t('common.host')}</h5>
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
                    <h5>{t('common.the_room')}</h5>
                    {activeRoom &&
                      <Panel header={activeRoomObj.name} style={{ boxShadow: 'none' }}>
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
                        </Row>
                      </Panel>
                    }
                  </Col>
                  {homestay.data.rooms.length > 1 &&
                    <Col xs={12}>
                      <a onClick={() => this.handleRoomDropdownChange(true)}><small>More rooms</small></a>
                    </Col>
                  }
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12}>
                    <h5>{t('common.Reviews')}</h5>
                  </Col>
                </Row>
                <Row style={styles.borderBottomPadded}>
                  <Col xs={12}>
                    <h5>{t('common.Location')}</h5>
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
                  <Panel style={styles.panel}>
                    <BookNow
                      cheapestWeeklyRate={cheapestWeeklyRate}
                      currencySymbol={currencySymbol}
                      determineCalendarConflict={this.determineCalendarConflict}
                      handleRoomDropdownChange={this.handleRoomDropdownChange}
                      roomSelectionOpen={this.state.roomSelectionOpen}
                      rooms={homestay.data.rooms}
                      roomCalendars={homestay.roomCalendars || null}
                    />
                  </Panel>
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
  t: PropTypes.func,
}
