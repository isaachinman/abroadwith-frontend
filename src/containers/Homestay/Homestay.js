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
import Lightbox from 'react-images'
import LightboxTheme from 'data/constants/LightboxTheme'
import { Link } from 'react-router'
import MapStyles from 'data/constants/MapStyles'
import { StickyContainer, Sticky } from 'react-sticky'
import { updateActiveRoom } from 'redux/modules/ui/search/homestaySearch'
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
        this.fetchRoomCalendar(homestay.data.rooms[0].id)
      } else {
        this.fetchRoomCalendar(activeRoom)
      }
    }


  }

  fetchRoomCalendar = roomID => {
    const { dispatch, homestay } = this.props
    dispatch(loadRoomCalendar(homestay.data.id, roomID))
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
    const { activeRoom, error, homestay, loading, uiCurrency, t } = this.props

    const activeRoomObj = homestay.data && activeRoom ? homestay.data.rooms.filter(room => room.id === activeRoom)[0] : {}
    const currencySymbol = Currencies[uiCurrency]
    console.log('activeRoomObj: ', activeRoomObj)

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
                    <p>
                      <Link to={`/user/${homestay.data.host.userId}`}>
                        {t('homes.more_about_host', { host: homestay.data.host.firstName })}
                      </Link>
                    </p>
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
                    <p>
                      <a>{t('common.words.more')}</a>
                    </p>
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
                              {homestay.data.immersions.stay && homestay.data.immersions.stay.isActive &&
                                <span className='immersion-tag large'>{t('immersions.stay')}: {currencySymbol}{activeRoomObj.price}</span>
                              }
                              {homestay.data.immersions.tandem && homestay.data.immersions.tandem.isActive &&
                                <span className='immersion-tag large'>{t('immersions.tandem')}: {currencySymbol}{Math.ceil(activeRoomObj.price * ((100 - homestay.data.immersions.tandem.languagesInterested[0].discount) / 100))}</span>
                              }
                              {homestay.data.immersions.teacher && homestay.data.immersions.teacher.isActive &&
                                <span className='immersion-tag large'>{t('immersions.teachers_stay')}: {currencySymbol}{Math.ceil((activeRoomObj.price + (homestay.data.immersions.teacher.hourly * homestay.data.immersions.teacher.packages[0])))}</span>
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
  loading: PropTypes.bool,
  uiCurrency: PropTypes.string,
  t: PropTypes.func,
}
