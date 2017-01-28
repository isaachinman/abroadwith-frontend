// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Col, Grid, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { fitBounds } from 'google-map-react/utils'
import Measure from 'react-measure'

// Relative imports
import Map from './subcomponents/Map'
import styles from './SearchHomestays.styles'

@connect(
  state => ({
    reviews: state.privateData.reviews,
  })
)
@translate()
export default class SearchHomestays extends Component {

  state = {
    map: {
      center: { lat: 52.52, lng: 13.405 },
      zoom: 9,
    },
  }

  handleLocationChange = newGeometry => {
    console.log(newGeometry)
  }

  handleSearchboxChange = place => {
    console.log('places changing')
    const { mapSize } = this.state
    const { viewport } = place.geometry
    const { center, zoom } = fitBounds(
      { nw: { lat: viewport.f.b, lng: viewport.b.b }, se: { lat: viewport.f.f, lng: viewport.b.f } },
      { width: mapSize.width, height: mapSize.height }
    )
    this.setState({ map: { center, zoom } })
  }

  render() {

    const { t } = this.props

    return (
      <div>
        <Helmet title={t('search.title')} />
        <Grid>
          <Row>
            <Col xs={12} md={7} style={styles.interactionPanel}>
              <div style={styles.headerBg}>
                <div style={styles.header}>
                  <h5>Find a place to stay.</h5>
                </div>
              </div>
            </Col>
            <Measure
              onMeasure={dimensions => this.setState({ mapSize: dimensions })}
            >
              <Col xsHidden smHidden md={5}>
                <Map
                  center={this.state.map.center}
                  handleSearchboxChange={this.handleSearchboxChange}
                  handleLocationChange={this.handleLocationChange}
                  zoom={this.state.map.zoom}
                  results={[
                  { lat: 52.52, lng: 13.405 },
                  ]}
                />
              </Col>
            </Measure>
          </Row>
        </Grid>
      </div>
    )
  }
}

SearchHomestays.propTypes = {
  t: PropTypes.func,
}
