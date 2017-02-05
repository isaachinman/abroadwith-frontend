// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import config from 'config'
import { connect } from 'react-redux'
import { Col, Grid, Panel, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { isLoaded, load as loadHomestay, loadRoomCalendar } from 'redux/modules/publicData/homes/loadHome'
import Lightbox from 'react-images'
import LightboxTheme from 'data/constants/LightboxTheme'
import { Link } from 'react-router'
import { StickyContainer, Sticky } from 'react-sticky'
import { translate } from 'react-i18next'

// Relative imports
import styles from './Homestay.styles'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const result = !isLoaded(getState(), params.homeID) ? dispatch(loadHomestay(params.homeID)) : null
    return __CLIENT__ ? null : result

  },
}])
@connect(
  (state, ownProps) => ({
    debug: ownProps,
    homestay: state.publicData.homestays[ownProps.params.homeID],
    error: state.publicData.homestays.error,
    loading: state.publicData.homestays.loading,
  })
)
@translate()
export default class Homestay extends Component {

  state = {
    lightboxOpen: false,
    lightboxImage: 0,
  }

  componentDidMount = () => {
    if (this.props.homestay.data) {
      this.setState({
        activeRoom: this.props.homestay.data.rooms[0],
      }, this.fetchRoomCalendar)
    }
  }

  fetchRoomCalendar = () => {
    const { activeRoom } = this.state
    const { dispatch, homestay } = this.props
    dispatch(loadRoomCalendar(homestay.data.id, activeRoom.id))
  }

  // Lightbox functions
  openLightbox = () => this.setState({ lightboxOpen: true })
  closeLightbox = () => this.setState({ lightboxOpen: false })
  goToPrevImage = () => this.setState({ lightboxImage: this.state.lightboxImage - 1 })
  goToNextImage = () => this.setState({ lightboxImage: this.state.lightboxImage + 1 })
  goToImage = index => this.setState({ lightboxImage: index })

  render() {

    const { lightboxOpen, lightboxImage } = this.state
    const { error, homestay, loading, t } = this.props

    /* eslint-disable */
    const {
      basics,
      description,
      host,
      id,
      immersions,
      isActive,
      location,
      pricing,
      rooms,
      stayAvailableLanguages,
      tandemAvailableLanguages,
      teacherAvailableLanguages,
    } = homestay && homestay.data ? homestay.data : {}
    /* eslint-enable */

    console.log(this)

    return (
      <div>
        <Helmet title='Homestay' />

        {!error && !loading && homestay && homestay.data &&

          <Grid style={styles.grid}>
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
                        {homestay.data.host.languagesLearning.map(language => <span>{t(`languages.${language.language}`)} ({t(`common.${language.level}`)}){homestay.data.host.languagesLearning.indexOf(language) !== homestay.data.host.languagesLearning.length - 1 ?
                          <span>,&nbsp;</span> : null}</span>)}
                      </p>
                    }
                    <p>
                      <strong>{t('common.Speaks')}: </strong>
                      {homestay.data.host.languagesKnown.map(language => <span>{t(`languages.${language.language}`)} ({t(`common.${language.level}`)}){homestay.data.host.languagesKnown.indexOf(language) !== homestay.data.host.languagesKnown.length - 1 ?
                        <span>,&nbsp;</span> : null}</span>)}
                    </p>
                    {homestay.data.immersions.teacher.isActive &&
                      <p>
                        <strong>{t('homes.teaches')}: </strong>
                        {homestay.data.immersions.teacher.languagesOffered.map(language => <span>{t(`languages.${language}`)}{homestay.data.immersions.teacher.languagesOffered.indexOf(language) !== homestay.data.immersions.teacher.languagesOffered.length - 1 ?
                          <span>,&nbsp;</span> : null}</span>)}
                      </p>
                    }
                  </Col>
                  <Col xs={12} md={6}>
                    <h5>{t('common.Details')}</h5>
                    <p>
                      <strong>{t('common.age')}: </strong>{homestay.data.host.age} {homestay.data.host.gender ? <span>({t(`users.genders.${homestay.data.host.gender}`)})</span> : null}
                    </p>
                    <p>
                      <strong>{t('common.Location')}: </strong>{homestay.data.location.city}, {t(`countries.${homestay.data.location.country}`)}
                    </p>
                  </Col>
                </Row>
              </div>
              <div style={styles.stickyContainer}>
                <Sticky
                  topOffset={-100}
                  stickyStyle={{ paddingTop: 100 }}
                >
                  <Panel style={styles.panel}>
                  Sticky panel
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
  dispatch: PropTypes.func,
  error: PropTypes.object,
  homestay: PropTypes.object,
  loading: PropTypes.bool,
  t: PropTypes.func,
}
