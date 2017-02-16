// Absolute imports
import React, { Component, PropTypes } from 'react'
import CharacterCounter from 'components/CharacterCounter/CharacterCounter'
import config from 'config'
import { connect } from 'react-redux'
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Row } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import Helmet from 'react-helmet'
import i18n from 'i18n/i18n-client'
import { push } from 'react-router-redux'
import Radium from 'radium'
import superagent from 'superagent'
import SpinLoader from 'components/SpinLoader/SpinLoader'
import { load as loadUser, update as updateUser } from 'redux/modules/privateData/users/loadUserWithAuth'
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
    user: this.props.user.data,
  }

  onDrop = acceptedFiles => {

    if (acceptedFiles.length > 0) {

      const { dispatch, jwt, token } = this.props

      const request = superagent.post(`/upload/users/${jwt.rid}/photo`)
      request.set({ abroadauth: `Bearer ${(token)}` })

      acceptedFiles.forEach(file => {
        request.attach('file', file)
      })

      request.end(err => {

        if (!err) {
          dispatch(loadUser(token))
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
                        <div style={{ marginBottom: 15 }}>{t('users.profile_picture_upload_explanation')}</div>
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
                            placeholder={t('manage_home.description_rules_placeholder')}
                            style={{ minHeight: 160 }}
                            defaultValue={user.data.aboutMe}
                            maxLength={510}
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
                            maxLength={100}
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
                            maxLength={100}
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
