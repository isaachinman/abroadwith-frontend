// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, ControlLabel, FormControl, Tooltip, Panel, PanelGroup, OverlayTrigger, Row } from 'react-bootstrap'
import { SimpleSelect as Select, MultiSelect } from 'react-selectize'
import { createRoom, updateRoomImage, deleteRoom } from 'redux/modules/privateData/homes/roomManagement'
import config from 'config'
import Dropzone from 'react-dropzone'
import RoomData from 'data/constants/RoomData'
import Switch from 'react-bootstrap-switch'
import shortid from 'shortid'

@translate()
export default class HomeRooms extends Component {

  state = {
    render: shortid(),
    rooms: this.props.home.data.rooms,
    newRoom: {
      name: null,
      description: null,
      vacancies: 1,
      shared: false,
      bed: null,
      facilities: [],
    },
    newRoomImg: null,
  }

  componentWillReceiveProps = nextProps => {
    const { home } = nextProps
    if (!home.loading && home.loaded) {
      this.setState({ rooms: home.data.rooms })
    }
  }

  newRoomDrop = acceptedFiles => {
    this.setState({ newRoomImg: acceptedFiles[0] })
  }

  existingRoomDrop = (acceptedFiles, roomID) => {
    const { token, dispatch, routeParams } = this.props
    dispatch(updateRoomImage(token, routeParams.homeID, roomID, acceptedFiles[0]))
  }

  handleValueChange = (roomIsNew, roomID, field, value) => {
    const state = this.state
    const objectToAffect = roomIsNew ? state.newRoom : state.rooms.filter(room => room.id === roomID)[0]
    objectToAffect[`${field}`] = value
    this.setState(state)
  }

  validateRoom = room => {

    let roomValidFields = 0

    // Validate room name
    if (typeof room.name === 'string' && room.name.length > 1) {
      roomValidFields++
    }

    // Validate room vacancies
    if (room.vacancies && room.vacancies === parseInt(room.vacancies)) {
      roomValidFields++
    }

    // Validate room shared
    if (typeof room.shared === 'boolean') {
      roomValidFields++
    }

    // Validate bed type
    if (room.bed && RoomData.bedTypes.indexOf(room.bed) > -1) {
      roomValidFields++
    }

    return roomValidFields === 4

  }

  // This function forces a rerender
  // react-bootstrap-switch doesn't render properly if hidden
  forceRender = () => {
    this.setState({ render: shortid() })
  }

  createRoom = () => {
    const { dispatch, token, inProgress, tabOverride, routeParams } = this.props
    const { newRoom, newRoomImg } = this.state
    if (inProgress) {
      tabOverride('rooms')
      dispatch(createRoom(token, routeParams.homeID, newRoom, newRoomImg))
      this.setState({
        newRoom: {
          name: null,
          description: null,
          vacancies: 1,
          shared: false,
          bed: null,
          facilities: [],
        },
      })
    } else {
      dispatch(createRoom(token, routeParams.homeID, newRoom, newRoomImg))
    }
  }

  goToNext = () => {
    this.props.tabOverride(false)
    this.updateRooms()
  }

  updateRooms = () => {
    this.props.updateHome(Object.assign({}, this.props.home.data, {
      rooms: this.state.rooms,
    }))
  }

  deleteRoom = roomID => {
    const { dispatch, token, routeParams } = this.props
    dispatch(deleteRoom(token, routeParams.homeID, roomID))
  }

  render() {

    const { newRoom, newRoomImg, render, rooms } = this.state
    const { home, inProgress, t } = this.props

    const loading = home.loading

    const alphabeticalRooms = rooms.sort((a, b) => {
      const x = a.name.toLowerCase()
      const y = b.name.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0 // eslint-disable-line
    })

    const newRoomIsValid = this.validateRoom(newRoom)
    const formIsValid = rooms.length > 0

    return (

      <span>
        <Row>
          <Col xs={12}>
            <PanelGroup
              onSelect={this.forceRender}
              id={render}
              defaultActiveKey={inProgress ? 'new-room' : null}
              accordion
            >
              <Panel
                bsStyle='info'
                header={t('manage_home.rooms_newone')}
                eventKey='new-room'
              >
                <Row>
                  <Col xs={12} md={6}>
                    <ControlLabel>{t('rooms.room_name_label')}*</ControlLabel>
                    <FormControl
                      type='text'
                      placeholder={t('rooms.room_name_placeholder')}
                      onChange={event => this.handleValueChange(true, null, 'name', event.target.value)}
                      value={newRoom.name || ''}
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <ControlLabel>{t('rooms.bed_types_label')}*</ControlLabel>
                    <Select
                      theme='bootstrap3'
                      placeholder={t('rooms.bed_types_placeholder')}
                      onValueChange={event => this.handleValueChange(true, null, 'bed', event.value)}
                      value={newRoom.bed ? { value: newRoom.bed, label: t(`rooms.bed_types.${newRoom.bed}`) } : null}
                    >
                      {RoomData.bedTypes.map(bedType => <option value={bedType} key={`newroombd${bedType}`}>{t(`rooms.bed_types.${bedType}`)}</option>)}
                    </Select>
                  </Col>
                </Row>

                <Row>
                  <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.rooms_vacancies_tooltip')}</Tooltip>}>
                    <Col xs={12} md={6}>
                      <ControlLabel>{t('rooms.vacancies_label')}*</ControlLabel>
                      <Select
                        theme='bootstrap3'
                        placeholder={t('rooms.vacancies_placeholder')}
                        onValueChange={event => this.handleValueChange(true, null, 'vacancies', event.value)}
                        value={newRoom.vacancies ? { value: newRoom.vacancies, label: newRoom.vacancies } : null}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </Select>
                    </Col>
                  </OverlayTrigger>
                  <Col xs={12} md={6}>
                    <ControlLabel>{t('rooms.facilities_label')}</ControlLabel>
                    <MultiSelect
                      theme='bootstrap3'
                      placeholder={t('rooms.facilities_label')}
                      options={RoomData.facilities.map(item => {
                        return { label: t(`rooms.facilities.${item}`), value: item }
                      })}
                      onValuesChange={event => this.handleValueChange(true, null, 'facilities', event.map(option => option.value))}
                      value={newRoom.facilities.map(item => {
                        return { label: t(`rooms.facilities.${item}`), value: item }
                      })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <ControlLabel>{t('rooms.shared_label')}</ControlLabel>
                    <div>
                      <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.rooms_shared_tooltip')}</Tooltip>}>
                        <span>
                          <Switch
                            inverse
                            labelText=''
                            onChange={(option, checked) => this.handleValueChange(true, null, 'shared', checked)}
                            offText={t('common.words.No')}
                            onText={t('common.words.Yes')}
                            value={newRoom.shared}
                          />
                        </span>
                      </OverlayTrigger>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <Dropzone
                      multiple={false}
                      onDrop={this.newRoomDrop}
                    >
                      <div>{t('manage_home.drop_room_photo')}</div>
                      {newRoomImg &&
                        <img src={newRoomImg.preview} className='dropzone-img' alt='New room' />
                      }
                    </Dropzone>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <ControlLabel>{t('rooms.Description')}</ControlLabel>
                    <FormControl
                      componentClass='textarea'
                      placeholder={t('rooms.description_placeholder')}
                      style={{ minHeight: 160 }}
                      onChange={event => this.handleValueChange(true, null, 'description', event.target.value)}
                      value={newRoom.description || ''}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <Button onClick={this.createRoom} disabled={!newRoomIsValid} bsStyle='primary'>{t('manage_home.save_button')}</Button>
                  </Col>
                </Row>

              </Panel>

              {alphabeticalRooms.map(room => {
                return (
                  <Panel
                    header={room.name}
                    key={room.id}
                    eventKey={room.id}
                  >
                    <Row>
                      <Col xs={12} md={6}>
                        <ControlLabel>{t('rooms.room_name_label')}*</ControlLabel>
                        <FormControl
                          type='text'
                          placeholder={t('rooms.room_name_placeholder')}
                          onChange={event => this.handleValueChange(false, room.id, 'name', event.target.value)}
                          value={room.name || ''}
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <ControlLabel>{t('rooms.bed_types_label')}*</ControlLabel>
                        <Select
                          theme='bootstrap3'
                          placeholder={t('rooms.bed_types_placeholder')}
                          onValueChange={event => this.handleValueChange(false, room.id, 'bed', event.value)}
                          value={room.bed ? { value: newRoom.bed, label: t(`rooms.bed_types.${room.bed}`) } : null}
                        >
                          {RoomData.bedTypes.map(bedType => <option value={bedType} key={`newroombd${bedType}`}>{t(`rooms.bed_types.${bedType}`)}</option>)}
                        </Select>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12} md={6}>
                        <ControlLabel>{t('rooms.vacancies_label')}*</ControlLabel>
                        <Select
                          theme='bootstrap3'
                          placeholder={t('rooms.vacancies_placeholder')}
                          onValueChange={event => this.handleValueChange(false, room.id, 'vacancies', event.value)}
                          value={room.vacancies ? { value: room.vacancies, label: room.vacancies } : null}
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </Select>
                      </Col>
                      <Col xs={12} md={6}>
                        <ControlLabel>{t('rooms.facilities_label')}</ControlLabel>
                        <MultiSelect
                          theme='bootstrap3'
                          placeholder={t('rooms.facilities_label')}
                          options={RoomData.facilities.map(item => {
                            return { label: t(`rooms.facilities.${item}`), value: item }
                          })}
                          onValuesChange={event => this.handleValueChange(false, room.id, 'facilities', event.map(option => option.value))}
                          values={room.facilities.map(item => {
                            return { label: t(`rooms.facilities.${item}`), value: item }
                          })}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} md={6}>
                        <ControlLabel>{t('rooms.shared_label')}</ControlLabel>
                        <div>
                          <Switch
                            inverse
                            labelText=''
                            onChange={(option, checked) => this.handleValueChange(false, room.id, 'shared', checked)}
                            offText={t('common.words.No')}
                            onText={t('common.words.Yes')}
                            value={room.shared}
                          />
                        </div>
                      </Col>
                      <Col xs={12} md={6}>
                        <Dropzone
                          multiple={false}
                          onDrop={acceptedFiles => this.existingRoomDrop(acceptedFiles, room.id)}
                        >
                          <div>{t('manage_home.drop_room_photo')}</div>
                          {room.img &&
                          <img src={`${config.img}${room.img}`} className='dropzone-img' alt={`${room.name}`} />
                        }
                        </Dropzone>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12}>
                        <ControlLabel>{t('rooms.Description')}</ControlLabel>
                        <FormControl
                          componentClass='textarea'
                          placeholder={t('rooms.description_placeholder')}
                          style={{ minHeight: 160 }}
                          onChange={event => this.handleValueChange(false, room.id, 'description', event.target.value)}
                          value={room.description || ''}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <Button onClick={this.updateRooms} disabled={!this.validateRoom(room)} bsStyle='primary'>{t('manage_home.save_button')}</Button>
                        {rooms.length > 1 &&
                          <Button
                            bsStyle='danger'
                            className='pull-right'
                            bsSize='xsmall'
                            onClick={() => this.deleteRoom(room.id)}
                          >
                            {t('manage_home.rooms_delete')}
                          </Button>
                        }
                        {rooms.length <= 1 &&
                          <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltip'>{t('manage_home.room_deletion_must_have_one')}</Tooltip>}>
                            <div className='pull-right' style={{ display: 'inline-block', cursor: 'not-allowed' }}>
                              <Button
                                style={{ pointerEvents: 'none' }}
                                bsStyle='danger'
                                bsSize='xsmall'
                                disabled
                              >
                                {t('manage_home.rooms_delete')}
                              </Button>
                            </div>
                          </OverlayTrigger>
                        }
                      </Col>
                    </Row>
                  </Panel>
                )
              })}

            </PanelGroup>
          </Col>
        </Row>
        {inProgress &&
          <Row>
            <Col xs={12}>
              <Button onClick={this.goToNext} disabled={!formIsValid || loading} bsStyle='primary'>
                {loading && <span>{t('common.Loading')}</span>}
                {!loading && (inProgress ? <span>{t('manage_home.next_button')}</span> : <span>{t('manage_home.save_button')}</span>)}
              </Button>
            </Col>
          </Row>
        }
      </span>

    )
  }
}

HomeRooms.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  inProgress: PropTypes.bool,
  t: PropTypes.func,
  routeParams: PropTypes.object,
  tabOverride: PropTypes.func,
  updateHome: PropTypes.func,
  token: PropTypes.string,
}
