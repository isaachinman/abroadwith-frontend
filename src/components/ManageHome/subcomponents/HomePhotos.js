// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Col, FormControl, Panel, Row } from 'react-bootstrap'
import { addHomePhoto, deleteHomePhoto } from 'redux/modules/privateData/homes/homeManagement'
import config from 'config'
import Dropzone from 'react-dropzone'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import FontAwesome from 'react-fontawesome'
import debounce from 'debounce'

// Styles
const styles = {
  dropzone: {
    width: '100%',
    padding: 20,
    border: '1px dotted black',
  },
  photoSquare: {
    minHeight: 300,
  },
  dragHandle: {
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

const DragHandle = SortableHandle(({ title }) => <div style={styles.dragHandle}>{title}</div>)

const SortableItem = SortableElement(({ image, ind, t, deletePhoto, handleValueChange }) => {
  return (
    <Col xs={12} md={4} key={`homeimg${image.id}${ind}`} style={styles.photoSquare}>
      <Panel
        header={image.caption ?
          <DragHandle title={image.caption} /> :
          <DragHandle title={t('manage_home.add_a_caption_to_image')} />}
        bsStyle={ind === 0 ? 'success' : 'default'}
      >
        <img src={`${config.img}${image.imagePath}`} className='dropzone-img' alt={`homeimg${image.id}`} />
        <div>
          <FormControl
            type='text'
            placeholder={t('rooms.room_name_placeholder')}
            onChange={event => handleValueChange(image.id, event.target.value)}
            value={image.caption || ''}
          />
        </div>
        {ind > 0 && <div onClick={() => deletePhoto(image.id)} className='pull-right' style={styles.trash}><FontAwesome name='trash' /></div>}
        {ind === 0 && <div><span style={styles.star}><FontAwesome name='star' /></span> {t('manage_home.featured_image')}</div>}
      </Panel>
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
    this.setState({ images: nextProps.home.data.images })
  }

  onDrop = acceptedFiles => {
    const { token, dispatch, routeParams } = this.props
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
    this.updatePhotos()
  }

  deletePhoto = photoID => {
    const { token, dispatch, routeParams } = this.props
    dispatch(deleteHomePhoto(token, routeParams.homeID, photoID))
  }

  updatePhotos = debounce(() => {
    this.props.updateHome(Object.assign({}, this.props.home.data, {
      images: this.state.images,
    }))
  }, 2000)

  render() {

    const { t } = this.props
    console.log(this.state.images)

    return (

      <span>
        <Row>
          <Col xs={12}>
            <p>{t('manage_home.photos_explanation')} {t('manage_home.at_least_one_photo_required')}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Dropzone
              onDrop={this.onDrop}
              style={styles.dropzone}
              disableClick
            >
              <Row>
                <Col xs={12}>
                  <div>{t('common.drop_files_here')}</div>
                </Col>
              </Row>
              <Row>
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
              </Row>
            </Dropzone>
          </Col>
        </Row>
      </span>

    )
  }
}

HomePhotos.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  routeParams: PropTypes.object,
  updateHome: PropTypes.func,
  t: PropTypes.func,
  token: PropTypes.string,
}
