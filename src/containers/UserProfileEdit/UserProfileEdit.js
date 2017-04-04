// Absolute imports
import React, { Component, PropTypes } from 'react'
import CharacterCounter from 'components/CharacterCounter/CharacterCounter'
import config from 'config'
import { connect } from 'react-redux'
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Modal, Row } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import Helmet from 'react-helmet'
import i18n from 'i18n/i18n-client'
import { load as loadUser, update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
import { load as loadPublicUser } from 'redux/modules/publicData/users/loadUser'
import { push } from 'react-router-redux'
import Radium from 'radium'
import ReactCrop from 'react-image-crop'
import superagent from 'superagent'
import SpinLoader from 'components/SpinLoader/SpinLoader'
import { translate } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'

// Relative imports
import styles from './UserProfileEdit.styles'

@connect(
  state => ({
    uiLanguage: state.ui.locale.value,
    user: state.privateData.user,
    jwt: state.auth.jwt,
    token: state.auth.token,
  })
)
@translate()
@Radium
export default class UserProfileEdit extends Component {

  state = {
    cropData: null,
    profilePhotoModalOpen: false,
    profilePhotoUploading: false,
    newProfilePhoto: null,
    uiCrop: { aspect: 1, width: 100, top: 0, x: 20 },
    user: this.props.user.data,
  }

  onDrop = acceptedFiles => {
    this.setState({ newProfilePhoto: acceptedFiles[0], profilePhotoModalOpen: true })
  }

  setCroppingData = (crop, pixelCrop) => this.setState({ cropData: pixelCrop, uiCrop: crop })

  closeProfilePhotoModal = () => this.setState({ newProfilePhoto: null, profilePhotoModalOpen: false })

  processUpload = () => {

    const { cropData, newProfilePhoto } = this.state

    if (newProfilePhoto) {

      this.setState({ profilePhotoUploading: true })

      const { dispatch, jwt, token } = this.props

      const request = superagent.post(`/upload/users/${jwt.rid}/photo`)
      request.set({ abroadauth: `Bearer ${(token)}` })
      request.set('cropData', JSON.stringify(cropData))
      request.attach('file', newProfilePhoto)

      request.end((err, res) => {

        if (!err) {
          dispatch(loadPublicUser(jwt.rid)) // Load public user object again - this is normally cached
          dispatch(loadUser(token))
          this.setState({
            cropData: null,
            newProfilePhoto: null,
            profilePhotoModalOpen: false,
            profilePhotoUploading: false,
            user: Object.assign({}, this.state.user, { photo: Object.values(JSON.parse(res.text))[0].location }),
          })
        }

      })
    }
  }

  updateUser = () => {

    const { dispatch, jwt, token } = this.props
    const newUserData = Object.assign({}, this.state.user)

    if (Array.isArray(newUserData.countriesLived) && newUserData.countriesLived.length > 0) {
      newUserData.countriesLived = JSON.stringify(newUserData.countriesLived)
    }

    if (Array.isArray(newUserData.countriesVisited) && newUserData.countriesVisited.length > 0) {
      newUserData.countriesVisited = JSON.stringify(newUserData.countriesVisited)
    }

    dispatch(updateUser(jwt.rid, newUserData, token, () => {
      dispatch(loadPublicUser(jwt.rid)) // Load public user object again - this is normally cached
      dispatch(push(`/user/${jwt.rid}`))
    }))

  }

  handleValueChange = (field, value) => {

    const newUserData = Object.assign({}, this.state.user)

    if (typeof value === 'string') {
      newUserData[field] = value || null
    } else if (Array.isArray(value)) {
      newUserData[field] = value.length > 0 ? value.map(item => item.id) : null
    }

    this.setState({
      user: newUserData,
    })

    console.log(value)

  }

  render() {

    const { newProfilePhoto, uiCrop, profilePhotoModalOpen, profilePhotoUploading } = this.state
    const { uiLanguage, user, t } = this.props

    const hasVisited = user && user.data && user.data.countriesVisited ? ((user.data.countriesVisited.replace(/['"]+/g, '')).replace(/[[\]']/g, '')).split(',') : null
    const hasLived = user && user.data && user.data.countriesLived ? ((user.data.countriesLived.replace(/['"]+/g, '')).replace(/[[\]']/g, '')).split(',') : null

    console.log(this)

    return (
      <div>

        <span>
          <Helmet title={t('users.edit_title')} />

          {user && user.data &&
            <SpinLoader show={user.loading}>
              <Grid style={styles.grid}>
                <div style={styles.bg} />

                <div style={styles.contentContainer}>

                  <Row>
                    <Col xs={12}>
                      <h1>{t('users.edit_title')}</h1>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <Dropzone
                        className='basic-dropzone'
                        activeClassName='basic-dropzone-active'
                        onDrop={this.onDrop}
                      >
                        <h6 className='text-muted' style={{ marginBottom: 15 }}>{t('users.profile_picture_upload_explanation')}</h6>
                        {user.data.photo &&
                          <img src={`${config.img}${user.data.photo}`} className='dropzone-img' alt='Your profile' />
                        }
                      </Dropzone>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>{t('users.edit_aboutme_title')}</ControlLabel>
                        <CharacterCounter>
                          <FormControl
                            componentClass='textarea'
                            style={{ minHeight: 160 }}
                            defaultValue={user.data.aboutMe}
                            maxLength={2000}
                            onChange={event => this.handleValueChange('aboutMe', event.target.value)}
                          />
                        </CharacterCounter>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>{t('users.edit_details_education_label')}</ControlLabel>
                        <CharacterCounter>
                          <FormControl
                            type='text'
                            placeholder={t('users.edit_details_education_placeholder')}
                            defaultValue={user.data.education}
                            maxLength={100}
                            onChange={event => this.handleValueChange('education', event.target.value)}
                          />
                        </CharacterCounter>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>{t('users.edit_details_grewup_label')}</ControlLabel>
                        <CharacterCounter>
                          <FormControl
                            type='text'
                            placeholder={t('users.edit_details_grewup_placeholder')}
                            defaultValue={user.data.grewUp}
                            maxLength={100}
                            onChange={event => this.handleValueChange('grewUp', event.target.value)}
                          />
                        </CharacterCounter>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>{t('users.edit_details_favouritebook_label')}</ControlLabel>
                        <CharacterCounter>
                          <FormControl
                            type='text'
                            placeholder={t('users.edit_details_favouritebook_placeholder')}
                            defaultValue={user.data.favBook}
                            maxLength={100}
                            onChange={event => this.handleValueChange('favBook', event.target.value)}
                          />
                        </CharacterCounter>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>{t('users.edit_details_favouritefilm_label')}</ControlLabel>
                        <CharacterCounter>
                          <FormControl
                            type='text'
                            placeholder={t('users.edit_details_favouritefilm_placeholder')}
                            defaultValue={user.data.favFilm}
                            maxLength={100}
                            onChange={event => this.handleValueChange('favFilm', event.target.value)}
                          />
                        </CharacterCounter>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>{t('users.edit_details_amazingfeat_label')}</ControlLabel>
                        <CharacterCounter>
                          <FormControl
                            type='text'
                            placeholder={t('users.edit_details_amazingfeat_placeholder')}
                            defaultValue={user.data.amazingFeat}
                            maxLength={45}
                            onChange={event => this.handleValueChange('amazingFeat', event.target.value)}
                          />
                        </CharacterCounter>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>{t('users.edit_details_share_label')}</ControlLabel>
                        <CharacterCounter>
                          <FormControl
                            type='text'
                            placeholder={t('users.edit_details_share_placeholder')}
                            defaultValue={user.data.canShare}
                            maxLength={45}
                            onChange={event => this.handleValueChange('canShare', event.target.value)}
                          />
                        </CharacterCounter>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('users.edit_details_interests_label')}</ControlLabel>
                      <Typeahead
                        multiple
                        placeholder={t('users.edit_details_interests_placeholder')}
                        options={Object.entries(i18n.store.data[uiLanguage].translation.interests).map(([id, label]) => ({ id, label }))}
                        onChange={value => this.handleValueChange('interests', value)}
                        defaultSelected={user.data.interests.map(interest => ({ id: interest, label: t(`interests.${interest}`) }))}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('users.edit_details_visited_label')}</ControlLabel>
                      <Typeahead
                        multiple
                        placeholder={t('users.edit_details_visited_placeholder')}
                        options={Object.entries(i18n.store.data[uiLanguage].translation.countries).map(([id, label]) => ({ id, label }))}
                        onChange={value => this.handleValueChange('countriesVisited', value)}
                        defaultSelected={hasVisited ? hasVisited.map(country => ({ id: country, label: t(`countries.${country}`) })) : []}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('users.edit_details_lived_label')}</ControlLabel>
                      <Typeahead
                        multiple
                        placeholder={t('users.edit_details_lived_placeholder')}
                        options={Object.entries(i18n.store.data[uiLanguage].translation.countries).map(([id, label]) => ({ id, label }))}
                        onChange={value => this.handleValueChange('countriesLived', value)}
                        defaultSelected={hasLived ? hasLived.map(country => ({ id: country, label: t(`countries.${country}`) })) : []}
                      />
                    </Col>
                  </Row>

                  <Row style={{ marginTop: 50 }}>
                    <Col xs={12}>
                      <Button onClick={this.updateUser} bsStyle='primary'>{t('users.edit_save')}</Button>
                    </Col>
                  </Row>

                </div>

                <Modal
                  backdrop='static'
                  show={profilePhotoModalOpen}
                  onHide={this.closeProfilePhotoModal}
                >
                  <SpinLoader show={profilePhotoUploading}>
                    <div>
                      <Modal.Header closeButton>
                        <Modal.Title>{t('users.crop_your_profile_photo')}</Modal.Title>
                      </Modal.Header>
                      <div style={styles.profilePhotoModalContent}>
                        {newProfilePhoto &&
                          <ReactCrop
                            crop={uiCrop}
                            src={newProfilePhoto.preview}
                            onComplete={this.setCroppingData}
                            onImageLoaded={(crop, image, pixelCrop) => this.setCroppingData(crop, pixelCrop)}
                          />
                          }
                      </div>
                      <Modal.Footer>
                        <Button onClick={this.processUpload} bsStyle='primary'>{t('manage_home.choose_picture_button')}</Button>
                      </Modal.Footer>
                    </div>
                  </SpinLoader>
                </Modal>

              </Grid>
            </SpinLoader>
          }
        </span>


      </div>
    )
  }
}

UserProfileEdit.propTypes = {
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  uiLanguage: PropTypes.object,
  user: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
