// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
// import config from 'config'
import superagent from 'superagent'
import { translate } from 'react-i18next'

@translate()
export default class CityInfo extends Component {

  state = {
    cityName: null,
  }

  componentDidMount = () => {

    const { lat, lng } = this.props

    const request = superagent.post('/public/closest-city')
    request.send({ lat, lng })
    request.end((err, res) => {
      if (!err) {
        this.setState({ cityName: res.body.cityName })
      }
    })

  }

  render() {

    return (
      <Row>
        <Col xs={12}>
          City info section
        </Col>
      </Row>
    )
  }
}

CityInfo.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  reviewInfo: PropTypes.object,
  t: PropTypes.func,
}
