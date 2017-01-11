// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Col, FormControl, Row } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import DefaultBankCurrencies from 'data/constants/DefaultBankCurrencies'
import { GoogleMapLoader, GoogleMap } from 'react-google-maps'

@translate()
export default class HomeLocation extends Component {

  render() {

    const { t } = this.props

    const countryOptionTags = Object.keys(DefaultBankCurrencies).map(country => t(`countries.${country}`))

    return (

      <span>
        <Row>
          <Col xs={12}>
            <FormControl
              type='text'
              placeholder={t('manage_home.location.address_line_1')}
              onChange={event => this.handleAddressChange(event)}
            />
          </Col>
          <Col xs={12} sm={6}>
            <FormControl
              type='text'
              placeholder={t('manage_home.location.address_line_2')}
              onChange={event => this.handleAddressChange(event)}
            />
          </Col>
          <Col xs={12} sm={6}>
            <FormControl
              type='text'
              placeholder={t('manage_home.location.neighbourhood')}
              onChange={event => this.handleAddressChange(event)}
            />
          </Col>
          <Col xs={12} sm={6}>
            <FormControl
              type='text'
              placeholder={t('manage_home.location.city_town')}
              onChange={event => this.handleAddressChange(event)}
            />
          </Col>
          <Col xs={12} sm={6}>
            <FormControl
              type='text'
              placeholder={t('manage_home.location.state')}
              onChange={event => this.handleAddressChange(event)}
            />
          </Col>
          <Col xs={12} sm={6}>
            <FormControl
              type='text'
              placeholder={t('manage_home.location.postcode')}
              onChange={event => this.handleAddressChange(event)}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Typeahead
              selected={[]}
              onChange={() => {}}
              placeholder={t('manage_home.location.country')}
              options={countryOptionTags}
            />
          </Col>
        </Row>
        <Row>
          <GoogleMapLoader
            containerElement={
              <div
                style={{
                  height: '100%',
                }}
              />
          }
            googleMapElement={
              <GoogleMap
                ref={(map) => console.log(map)}
                defaultZoom={3}
                defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
              />
          }
          />
        </Row>
      </span>

    )
  }
}

HomeLocation.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
