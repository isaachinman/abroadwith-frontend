// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, FormControl, Row } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import DefaultBankCurrencies from 'data/constants/DefaultBankCurrencies'
import GoogleMap from 'google-map-react'
import { MapCircle } from 'components'
import MapStyles from 'data/constants/MapStyles'
import debounce from 'debounce'

// Styles
const styles = {
  input: {
    marginBottom: 10,
  },
  mapContainer: {
    height: 340,
  },
}

@translate()
export default class HomeLocation extends Component {

  state = {
    mapRender: this.props.activeTab === 'location',
    newLocation: {
      lat: null,
      lng: null,
      street: null,
      complement: null,
      neighbourhood: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
    },
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.home && nextProps.home.loaded && nextProps.home.data.location && !this.state.newLocation.lat) {
      this.setState({
        newLocation: nextProps.home.data.location,
      })
    }
  }

  componentWillUpdate = nextProps => {
    // Google map component must be re-rendered if it was previously hidden
    if (this.props.activeTab !== 'location' && nextProps.activeTab === 'location') {
      this.setState({ mapRender: false })
      setTimeout(() => this.setState({ mapRender: true }), 250)
    }
  }

  handleAddressChange = (value, field) => {
    const { newLocation } = this.state
    newLocation[field] = value
    this.setState({ newLocation }, this.geolocateAddress)
  }

  geolocateAddress = debounce(() => {

    const { newLocation } = this.state
    const numberOfFilledFields = Object.values(newLocation).filter(field => typeof field === 'string').length

    if (numberOfFilledFields >= 4) {

      let queryString = ''
      Object.keys(newLocation).map(field => {
        const value = newLocation[field]
        if (field !== 'country' && field !== 'complement' && typeof value === 'string' && value.length > 0) {
          queryString += value.split(/[ ,]+/).join('+') + ','
        }
      })

      if (newLocation.country) {
        queryString += this.props.t(`countries.${newLocation.country}`).split(/[ ,]+/).join('+') + ','
      }

      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${queryString}&key=AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ`)
        .then(res => {
          if (res.ok) {
            res.json().then(data => {
              if (data.status === 'OK' && data.results.length > 0) {
                newLocation.lat = data.results[0].geometry.location.lat
                newLocation.lng = data.results[0].geometry.location.lng
                this.setState({ newLocation })
              }
            })
          }
        })
    }
  }, 1000)

  manuallyChangeHomeCoordinates = (hoverKey, childProps, mouse) => {
    const { newLocation } = this.state
    newLocation.lat = mouse.lat
    newLocation.lng = mouse.lng
    this.setState({ newLocation })
  }

  updateLocation = () => {
    this.props.updateHome(Object.assign({}, this.props.home.data, {
      location: this.state.newLocation,
    }))
  }

  render() {

    const { inProgress, home, t } = this.props
    const { newLocation } = this.state

    const loading = home.loading

    const countryOptionTags = Object.keys(DefaultBankCurrencies).map(country => {
      return { id: country, label: t(`countries.${country}`) }
    })

    const hasGeolocation = newLocation.lat && newLocation.lng
    const addressIsValid = newLocation.street && newLocation.city && newLocation.state && newLocation.zipCode && newLocation.country && newLocation.lat && newLocation.lng

    console.log(this)

    return (

      <span>
        <Row>
          <Col xs={12} style={styles.input}>
            <FormControl
              type='text'
              placeholder={`${t('manage_home.location.address_line_1')}*`}
              onChange={event => this.handleAddressChange(event.target.value, 'street')}
              value={newLocation.street || ''}
            />
          </Col>
          <Col xs={12} sm={6} style={styles.input}>
            <FormControl
              type='text'
              placeholder={t('manage_home.location.address_line_2')}
              onChange={event => this.handleAddressChange(event.target.value, 'complement')}
              value={newLocation.complement || ''}
            />
          </Col>
          <Col xs={12} sm={6} style={styles.input}>
            <FormControl
              type='text'
              placeholder={t('manage_home.location.neighbourhood')}
              onChange={event => this.handleAddressChange(event.target.value, 'neighbourhood')}
              value={newLocation.neighbourhood || ''}
            />
          </Col>
          <Col xs={12} sm={6} style={styles.input}>
            <FormControl
              type='text'
              placeholder={`${t('manage_home.location.city_town')}*`}
              onChange={event => this.handleAddressChange(event.target.value, 'city')}
              value={newLocation.city || ''}
            />
          </Col>
          <Col xs={12} sm={6} style={styles.input}>
            <FormControl
              type='text'
              placeholder={`${t('manage_home.location.state')}*`}
              onChange={event => this.handleAddressChange(event.target.value, 'state')}
              value={newLocation.state || ''}
            />
          </Col>
          <Col xs={12} sm={6} style={styles.input}>
            <FormControl
              type='text'
              placeholder={`${t('manage_home.location.postcode')}*`}
              onChange={event => this.handleAddressChange(event.target.value, 'zipCode')}
              value={newLocation.zipCode || ''}
            />
          </Col>
          <Col xs={12} sm={6} style={styles.input}>
            <Typeahead
              selected={newLocation.country ? [{ label: t(`countries.${newLocation.country}`), id: newLocation.country }] : []}
              onChange={value => this.handleAddressChange(value[0].id, 'country')}
              placeholder={`${t('manage_home.location.country')}*`}
              options={countryOptionTags}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <span style={{ display: 'none' }}>{}</span>
            <div style={styles.mapContainer}>
              {this.state.mapRender &&
                <GoogleMap
                  center={hasGeolocation ? { lat: newLocation.lat, lng: newLocation.lng } : { lat: 51.5074, lng: 0.1278 }}
                  draggable={!this.state.mapChildDragging}
                  zoom={hasGeolocation ? 14 : 1}
                  onChildMouseDown={() => this.setState({ mapChildDragging: true })}
                  onChildMouseUp={() => this.setState({ mapChildDragging: false })}
                  onChildMouseMove={this.manuallyChangeHomeCoordinates}
                  options={() => ({
                    panControl: false,
                    mapTypeControl: false,
                    scrollwheel: false,
                    styles: MapStyles,
                  })}
                >
                  {hasGeolocation &&
                    <MapCircle lat={newLocation.lat} lng={newLocation.lng} />
                  }
                </GoogleMap>
              }
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {t('manage_home.drag_and_drop_location_circle')}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button onClick={this.updateLocation} disabled={!addressIsValid || loading} bsStyle='primary'>
              {loading && <span>{t('common.Loading')}</span>}
              {!loading && (inProgress ? <span>{t('manage_home.next_button')}</span> : <span>{t('manage_home.save_button')}</span>)}
            </Button>
          </Col>
        </Row>
      </span>

    )
  }
}

HomeLocation.propTypes = {
  activeTab: PropTypes.string,
  dispatch: PropTypes.func,
  home: PropTypes.object,
  inProgress: PropTypes.bool,
  t: PropTypes.func,
  updateHome: PropTypes.func,
  token: PropTypes.string,
}
