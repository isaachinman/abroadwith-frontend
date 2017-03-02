// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, FormControl, Tooltip, Thumbnail, OverlayTrigger, Row } from 'react-bootstrap'
import { addHomePhoto, deleteHomePhoto } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import config from 'config'
import Dropzone from 'react-dropzone'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import FontAwesome from 'react-fontawesome'
import debounce from 'debounce'
import { SpinLoader } from 'components'

// Styles
const styles = {
  photoContainer: {
    width: '100%',
    padding: 20,
    border: '1px dashed #d9d9d9',
    margin: '0 15px',
  },
  dropzone: {
    cursor: 'pointer',
    textAlign: 'center',
    padding: '30px 0 40px 0',
  },
  dragHandle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 165,
    cursor: 'move',
  },
  trash: {
    fontSize: 16,
    cursor: 'pointer',
    zIndex: 10,
  },
  star: {
    fontSize: 16,
  },
}

const DragHandle = SortableHandle(() => <div style={styles.dragHandle} />)

const SortableItem = SortableElement(({ image, ind, t, deletePhoto, handleValueChange }) => {
  return (
    <Col xs={12} md={6} lg={4} key={`homeimg${image.id}${ind}`} className='home-photo-thumbnail'>
      <Thumbnail src={`${config.img}${image.imagePath}`} alt='242x200'>
        <DragHandle />
        <div>
          <FormControl
            type='text'
            placeholder={t('rooms.room_name_placeholder')}
            onChange={event => handleValueChange(image.id, event.target.value)}
            value={image.caption || ''}
          />
        </div>
        <div className='info'>
          {ind > 0 &&
            <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltip'>{t('manage_home.delete_photo_tooltip')}</Tooltip>}>
              <div onClick={() => deletePhoto(image.id)} className='pull-right' style={styles.trash}>
                <FontAwesome name='trash' />
              </div>
            </OverlayTrigger>
          }
          {ind === 0 && <div><span style={styles.star}><FontAwesome name='star' /></span> {t('manage_home.featured_image')}</div>}
        </div>
      </Thumbnail>
    </Col>
  )
})
const SortableList = SortableContainer(({ images, t, deletePhoto, handleValueChange }) => {
  return (
    <div>
      {images.map((image, index) => {
        return (
          <SortableItem
            t={t}
            key={`item-${image.id}-${index}`}
            ind={index}
            index={index}
            image={image}
            deletePhoto={deletePhoto}
            handleValueChange={handleValueChange}
          />
        )
      })}
    </div>
  )
})

@translate()
export default class HomePhotos extends Component {

  state = {
    images: this.props.home.data.images,
  }

  componentWillReceiveProps = nextProps => {
    const { home } = nextProps
    if (!home.loading && home.loaded) {
      this.setState({ images: home.data.images })
    }
  }

  onDrop = acceptedFiles => {
    const { token, inProgress, tabOverride, dispatch, routeParams } = this.props
    if (inProgress) {
      tabOverride('photos')
    }
    dispatch(addHomePhoto(token, routeParams.homeID, acceptedFiles))
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      images: arrayMove(this.state.images, oldIndex, newIndex),
    })
  }

  handleValueChange = (imageID, value) => {
    const { images } = this.state
    const newImage = images.filter(img => img.id === imageID)[0]
    newImage.caption = value
    this.setState({ images: images.map(image => image.id === imageID ? newImage : image) })
    this.debouncedUpdate()
  }

  deletePhoto = photoID => {
    const { token, dispatch, routeParams } = this.props
    dispatch(deleteHomePhoto(token, routeParams.homeID, photoID))
  }

  goToNext = () => {
    const { tabOverride, home, updateHome } = this.props
    tabOverride(false)
    updateHome(Object.assign({}, home.data, {
      images: this.state.images,
    }))
  }

  debouncedUpdate = debounce(() => {
    this.updatePhotos()
  }, 1000)

  updatePhotos = () => {
    const { home, updateHome } = this.props
    updateHome(Object.assign({}, home.data, {
      images: this.state.images,
    }))
  }

  render() {

    const { home, inProgress, t } = this.props
    const formIsValid = this.state.images.length > 0
    const loading = home.loading

    return (

      <span>
        <Row>
          <Col xs={12}>
            <p>{t('manage_home.photos_explanation')} {t('manage_home.at_least_one_photo_required')}</p>
          </Col>
        </Row>
        <Row>
          <SpinLoader show={home.photosLoading}>
            <Col xs={12} style={styles.photoContainer}>
              <Dropzone
                onDrop={this.onDrop}
                style={styles.dropzone}
              >
                <FontAwesome name='inbox' size='4x' style={{ color: '#5A65DB' }} />
                <h5>{t('common.drop_files_here')}</h5>
              </Dropzone>

              <SortableList
                axis={'xy'}
                useWindowAsScrollContainer
                useDragHandle
                images={this.state.images}
                onSortEnd={this.onSortEnd}
                t={t}
                deletePhoto={this.deletePhoto}
                handleValueChange={this.handleValueChange}
              />
            </Col>
          </SpinLoader>
        </Row>
        <Row>
          <Col xs={12}>
            <Button onClick={inProgress ? this.goToNext : this.updatePhotos} disabled={!formIsValid || loading} bsStyle='primary'>
              {loading && <span>{t('common.Loading')}</span>}
              {!loading && (inProgress ? <span>{t('manage_home.next_button')}</span> : <span>{t('manage_home.save_button')}</span>)}
            </Button>
          </Col>
        </Row>
      </span>

    )
  }
}

HomePhotos.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  inProgress: PropTypes.bool,
  routeParams: PropTypes.object,
  tabOverride: PropTypes.func,
  updateHome: PropTypes.func,
  t: PropTypes.func,
  token: PropTypes.string,
}
