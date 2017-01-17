// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, ControlLabel, InputGroup, ListGroup, ListGroupItem, FormControl, FormGroup, OverlayTrigger, Tooltip, Row } from 'react-bootstrap'
import Currencies from 'data/constants/Currencies'
import FontAwesome from 'react-fontawesome'


// Arrays to iterate over
const lengthDiscounts = ['oneMonthDiscount', 'threeMonthDiscount', 'sixMonthDiscount']
const extras = ['CLEANING', 'AIRPORT_PICKUP', 'LAUNDRY', 'EXTRA_GUEST', 'HALF_BOARD', 'FULL_BOARD']

@translate()
export default class HomePricing extends Component {

  state = {
    pricing: this.props.home.data.pricing,
    rooms: this.props.home.data.rooms,
  }

  componentWillReceiveProps = nextProps => {
    const { home } = nextProps
    if (!home.loading && home.loaded) {
      this.setState({ pricing: nextProps.home.data.pricing, rooms: nextProps.home.data.rooms })
    }
  }

  handleCurrencyChange = value => {
    const { pricing } = this.state
    pricing.currency = value
    this.setState({ pricing })
  }

  // Because of the idiotic way the data is structured,
  // this is the way it must be done
  handleDiscountChange = (field, amount) => {
    if ((parseInt(amount) >= 0 && parseInt(amount) <= 100) || amount === '') {
      const { pricing } = this.state
      const newPricing = Object.assign({}, pricing)
      newPricing.discounts = amount !== '' ? [
        {
          name: field,
          amount: parseInt(amount),
        },
      ] : []
      for (let i = 0; i < lengthDiscounts.length; i++) {
        if (lengthDiscounts[i] !== field) {
          if (pricing.discounts.filter(discount => discount.name === lengthDiscounts[i])[0]) {
            newPricing.discounts.push(pricing.discounts.filter(discount => discount.name === lengthDiscounts[i])[0])
          }
        }
      }
      this.setState({ pricing: newPricing })
    }
  }

  handleRoomChange = (roomID, value) => {
    if ((parseInt(value) >= 0 && parseInt(value) <= 1000) || value === '') {
      const state = this.state
      const objectToAffect = state.rooms.filter(room => room.id === roomID)[0]
      objectToAffect.price = value || null
      this.setState(state)
    }
  }

  handleExtraChange = (field, amount) => {
    if ((parseInt(amount) >= 0 && parseInt(amount) <= 1000) || amount === '') {
      const { pricing } = this.state
      const newPricing = Object.assign({}, pricing)
      newPricing.extras = amount !== '' ? [
        {
          service: field,
          cost: parseInt(amount),
        },
      ] : []
      for (let i = 0; i < extras.length; i++) {
        if (extras[i] !== field) {
          if (pricing.extras.filter(extra => extra.service === extras[i])[0]) {
            newPricing.extras.push(pricing.extras.filter(extra => extra.service === extras[i])[0])
          }
        }
      }
      this.setState({ pricing: newPricing })
    }
  }

  updatePricing = () => {
    const { home, updateHome } = this.props
    updateHome(Object.assign({}, home.data, {
      rooms: this.state.rooms,
      pricing: this.state.pricing,
    }))
  }

  render() {

    const { rooms, pricing } = this.state
    const { home, inProgress, t } = this.props

    const loading = home.loading
    const formIsValid = !rooms.some(room => !room.price)

    // Generate discounts (re: idiotic data structures)
    const oneMonthDiscount = pricing.discounts.filter(discount => discount.name === 'oneMonthDiscount')[0] ? pricing.discounts.filter(discount => discount.name === 'oneMonthDiscount')[0].amount : ''
    const threeMonthDiscount = pricing.discounts.filter(discount => discount.name === 'threeMonthDiscount')[0] ? pricing.discounts.filter(discount => discount.name === 'threeMonthDiscount')[0].amount : '' // eslint-disable-line
    const sixMonthDiscount = pricing.discounts.filter(discount => discount.name === 'sixMonthDiscount')[0] ? pricing.discounts.filter(discount => discount.name === 'sixMonthDiscount')[0].amount : ''

    // Generate extras
    const extraGuest = pricing.extras.filter(extra => extra.service === 'EXTRA_GUEST')[0] ? pricing.extras.filter(extra => extra.service === 'EXTRA_GUEST')[0].cost : ''
    const fullBoard = pricing.extras.filter(extra => extra.service === 'FULL_BOARD')[0] ? pricing.extras.filter(extra => extra.service === 'FULL_BOARD')[0].cost : ''
    const halfBoard = pricing.extras.filter(extra => extra.service === 'HALF_BOARD')[0] ? pricing.extras.filter(extra => extra.service === 'HALF_BOARD')[0].cost : ''
    const laundry = pricing.extras.filter(extra => extra.service === 'LAUNDRY')[0] ? pricing.extras.filter(extra => extra.service === 'LAUNDRY')[0].cost : ''
    const cleaning = pricing.extras.filter(extra => extra.service === 'CLEANING')[0] ? pricing.extras.filter(extra => extra.service === 'CLEANING')[0].cost : ''
    const airportPickup = pricing.extras.filter(extra => extra.service === 'AIRPORT_PICKUP')[0] ? pricing.extras.filter(extra => extra.service === 'AIRPORT_PICKUP')[0].cost : ''

    return (

      <form>
        <FormGroup
          controlId='homeBasics'
          validationState={null}
        >
          <Row>
            <Col xs={12} md={6} lg={3}>
              <ControlLabel>{t('manage_home.pricing_currency_label')}*</ControlLabel>
              <FormControl
                componentClass='select'
                onChange={event => this.handleCurrencyChange(event.target.value)}
                value={pricing.currency || ''}
              >
                {Object.keys(Currencies).map(currency => {
                  return (
                    <option value={currency} key={currency}>{currency}</option>
                  )
                })}
              </FormControl>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <ControlLabel>{t('manage_home.pricing_discount1')}</ControlLabel>
              <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.pricing_time_tooltip')}</Tooltip>}>
                <FontAwesome name='question-circle' className='pull-right text-muted' />
              </OverlayTrigger>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type='text'
                    placeholder='5'
                    value={oneMonthDiscount}
                    onChange={event => this.handleDiscountChange('oneMonthDiscount', event.target.value)}
                  />
                  <InputGroup.Addon>%</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <ControlLabel>{t('manage_home.pricing_discount3')}</ControlLabel>
              <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.pricing_time_tooltip')}</Tooltip>}>
                <FontAwesome name='question-circle' className='pull-right text-muted' />
              </OverlayTrigger>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type='text'
                    placeholder='7'
                    value={threeMonthDiscount}
                    onChange={event => this.handleDiscountChange('threeMonthDiscount', event.target.value)}
                  />
                  <InputGroup.Addon>%</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <ControlLabel>{t('manage_home.pricing_discount6')}</ControlLabel>
              <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.pricing_time_tooltip')}</Tooltip>}>
                <FontAwesome name='question-circle' className='pull-right text-muted' />
              </OverlayTrigger>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type='text'
                    placeholder='14'
                    value={sixMonthDiscount}
                    onChange={event => this.handleDiscountChange('sixMonthDiscount', event.target.value)}
                  />
                  <InputGroup.Addon>%</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={6}>
              <h4>{t('manage_home.pricing_room_rates')}</h4>
              <ListGroup>
                {rooms.map(room => {
                  return (
                    <ListGroupItem key={`room${room.id}`}>
                      <div>
                        <h5 className='list-group-item-heading'>{room.name} <small>{t(`rooms.bed_types.${room.bed}`)} / {t('rooms.vacancies_label')}: {room.vacancies}</small></h5>
                        <ControlLabel>{t('rooms.Weekly_rate')}</ControlLabel>
                        <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('rooms.price_tooltip')}</Tooltip>}>
                          <FontAwesome name='question-circle' className='pull-right text-muted' />
                        </OverlayTrigger>
                        <FormGroup>
                          <InputGroup>
                            <FormControl
                              type='text'
                              placeholder='150'
                              onChange={event => this.handleRoomChange(room.id, event.target.value)}
                              value={room.price || ''}
                            />
                            <InputGroup.Addon>{Currencies[pricing.currency]}</InputGroup.Addon>
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </ListGroupItem>
                )
                })}
              </ListGroup>
            </Col>

            <Col xs={12} lg={6}>
              <h4>{t('manage_home.pricing_extra_charges')}</h4>
              <ListGroup>
                <ListGroupItem>
                  <div>
                    <h5 className='list-group-item-heading'>{t('homes.extras.EXTRA_GUEST')}</h5>
                    <ControlLabel>{t('rooms.Weekly_rate')}</ControlLabel>
                    <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.pricing_extra_guest_tooltip')}</Tooltip>}>
                      <FontAwesome name='question-circle' className='pull-right text-muted' />
                    </OverlayTrigger>
                    <FormGroup>
                      <InputGroup>
                        <FormControl
                          type='text'
                          placeholder='20'
                          onChange={event => this.handleExtraChange('EXTRA_GUEST', event.target.value)}
                          value={extraGuest}
                        />
                        <InputGroup.Addon>{Currencies[pricing.currency]}</InputGroup.Addon>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <div>
                    <h5 className='list-group-item-heading'>{t('homes.menus_offered.FULL_BOARD')}</h5>
                    <ControlLabel>{t('rooms.Weekly_rate')}</ControlLabel>
                    <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.pricing_full_board_tooltip')}</Tooltip>}>
                      <FontAwesome name='question-circle' className='pull-right text-muted' />
                    </OverlayTrigger>
                    <FormGroup>
                      <InputGroup>
                        <FormControl
                          type='text'
                          placeholder='20'
                          onChange={event => this.handleExtraChange('FULL_BOARD', event.target.value)}
                          value={fullBoard}
                        />
                        <InputGroup.Addon>{Currencies[pricing.currency]}</InputGroup.Addon>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <div>
                    <h5 className='list-group-item-heading'>{t('homes.menus_offered.HALF_BOARD')}</h5>
                    <ControlLabel>{t('rooms.Weekly_rate')}</ControlLabel>
                    <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.pricing_half_board_tooltip')}</Tooltip>}>
                      <FontAwesome name='question-circle' className='pull-right text-muted' />
                    </OverlayTrigger>
                    <FormGroup>
                      <InputGroup>
                        <FormControl
                          type='text'
                          placeholder='20'
                          onChange={event => this.handleExtraChange('HALF_BOARD', event.target.value)}
                          value={halfBoard}
                        />
                        <InputGroup.Addon>{Currencies[pricing.currency]}</InputGroup.Addon>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <div>
                    <h5 className='list-group-item-heading'>{t('homes.extras.LAUNDRY')}</h5>
                    <ControlLabel>{t('rooms.Weekly_rate')}</ControlLabel>
                    <FormGroup>
                      <InputGroup>
                        <FormControl
                          type='text'
                          placeholder='20'
                          onChange={event => this.handleExtraChange('LAUNDRY', event.target.value)}
                          value={laundry}
                        />
                        <InputGroup.Addon>{Currencies[pricing.currency]}</InputGroup.Addon>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <div>
                    <h5 className='list-group-item-heading'>{t('homes.extras.CLEANING')}</h5>
                    <ControlLabel>{t('rooms.Weekly_rate')}</ControlLabel>
                    <FormGroup>
                      <InputGroup>
                        <FormControl
                          type='text'
                          placeholder='20'
                          onChange={event => this.handleExtraChange('CLEANING', event.target.value)}
                          value={cleaning}
                        />
                        <InputGroup.Addon>{Currencies[pricing.currency]}</InputGroup.Addon>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <div>
                    <h5 className='list-group-item-heading'>{t('homes.extras.AIRPORT_PICKUP')}</h5>
                    <ControlLabel>{t('rooms.Weekly_rate')}</ControlLabel>
                    <FormGroup>
                      <InputGroup>
                        <FormControl
                          type='text'
                          placeholder='20'
                          onChange={event => this.handleExtraChange('AIRPORT_PICKUP', event.target.value)}
                          value={airportPickup}
                        />
                        <InputGroup.Addon>{Currencies[pricing.currency]}</InputGroup.Addon>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button onClick={this.updatePricing} disabled={!formIsValid || loading} bsStyle='primary'>
                {loading && <span>{t('common.Loading')}</span>}
                {!loading && (inProgress ? <span>{t('manage_home.next_button')}</span> : <span>{t('manage_home.save_button')}</span>)}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <p>{t('manage_home.pricing_fee_explanation')}</p>
            </Col>
          </Row>
        </FormGroup>
      </form>

    )
  }
}

HomePricing.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  inProgress: PropTypes.bool,
  t: PropTypes.func,
  token: PropTypes.string,
  updateHome: PropTypes.func,
}
