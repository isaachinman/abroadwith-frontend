// Absolute imports
import React, { Component, PropTypes } from 'react'
import config from 'config'
import { connect } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { load as loadHomestay } from 'redux/modules/publicData/homes/loadHome'
import { uiDate } from 'utils/dates'
import { translate } from 'react-i18next'

// Styles
const styles = {
  homePhoto: {
    width: '100%',
    height: 240,
    borderRadius: 5,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  rightAlign: {
    textAlign: 'right',
    fontWeight: 400,
  },
}

@connect(
  state => ({
    homestays: state.publicData.homestays,
    jwt: state.auth.jwt,
  })
)
@translate()
export default class ThreadHomeInfo extends Component {

  componentWillMount = () => {

    const { dispatch, homestays, thread } = this.props

    if (!homestays[thread.homeId]) {
      dispatch(loadHomestay(thread.homeId))
    }

  }

  render() {

    const { homestays, jwt, t, thread } = this.props
    const home = homestays[thread.homeId] ? homestays[thread.homeId].data : false
    const userIsGuest = thread.guestId === jwt.rid
    const theirName = thread.with.firstName

    return (
      <span>
        {home &&
          <span>
            <Row>
              <Col xs={12}>
                <div style={Object.assign({}, styles.homePhoto, { backgroundImage: `url(${config.img}${home.images[0].imagePath})` })} />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr style={styles.tr}>
                      <th>{t('inbox.host')}:</th>
                      <th style={styles.rightAlign}>{!userIsGuest ? <span>{t('inbox.You')}</span> : <span>{theirName}</span>}</th>
                    </tr>
                    <tr style={styles.tr}>
                      <th>{t('inbox.guest')}:</th>
                      <th style={styles.rightAlign}>{userIsGuest ? <span>{t('inbox.You')}</span> : <span>{theirName}</span>}</th>
                    </tr>
                    <tr style={styles.tr}>
                      <th>{t('common.Arrival')}:</th>
                      <th style={styles.rightAlign}>{uiDate(thread.arrival)}</th>
                    </tr>
                    <tr style={styles.tr}>
                      <th>{t('common.Departure')}:</th>
                      <th style={styles.rightAlign}>{uiDate(thread.departure)}</th>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </span>
        }
      </span>
    )
  }
}

ThreadHomeInfo.propTypes = {
  dispatch: PropTypes.func,
  homestays: PropTypes.object,
  jwt: PropTypes.object,
  t: PropTypes.func,
  thread: PropTypes.object.isRequired,
}
