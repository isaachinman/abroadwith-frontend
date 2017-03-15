// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import { asyncConnect } from 'redux-connect'
import { CityInfo } from 'components'
// import config from 'config'
import { connect } from 'react-redux'
// import Currencies from 'data/constants/Currencies'
// import GoogleMap from 'google-map-react'
// import Helmet from 'react-helmet'
import { isLoaded, load as loadEducator } from 'redux/modules/publicData/educators/loadEducator'
// import { load as loadUser } from 'redux/modules/publicData/users/loadUser'
// import Lightbox from 'react-images'
// import LightboxTheme from 'data/constants/LightboxTheme'
// import { Link } from 'react-router'
// import MapStyles from 'data/constants/MapStyles'
// import shallowCompare from 'react-addons-shallow-compare'
// import SendNewMessageToHost from 'components/SendNewMessageToHost/SendNewMessageToHost'
// import { StickyContainer, Sticky } from 'react-sticky'
// import { updateActiveCourse } from 'redux/modules/ui/search/courseSearch'
import Radium from 'radium'
import { translate } from 'react-i18next'

// Relative imports
// import BookNow from './subcomponents/BookNow'
// import HomestayReviews from './subcomponents/HomestayReviews'
import styles from './School.styles'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const promises = []

    if (!isLoaded(getState(), params.educatorID)) {
      promises.push(dispatch(loadEducator(params.educatorID)))
    }

    return Promise.all(promises)

  },
}])
@connect(
  (state, ownProps) => ({
    activeCourse: state.uiPersist.courseSearch.activeCourse,
    error: state.publicData.educators.error,
    educator: state.publicData.educators[ownProps.params.educatorID],
    courseSearch: state.uiPersist.courseSearch,
    loading: state.publicData.educators.loading,
    token: state.auth.token || null,
    uiCurrency: state.ui.currency.value,
    currencyRates: state.ui.currency.exchangeRates.data.rates,
  })
)
@translate()
@Radium
export default class School extends Component {

  render() {

    console.log(this)

    const { educator } = this.props

    return (
      <div style={{ marginBottom: -20 }}>

        {educator && educator.id &&

          <Grid>

            <div className='school-profile-page-header'>
              <Row style={styles.headerRow}>
                <Col xs={12}>
                  <h1>{educator.schoolName}</h1>
                </Col>
              </Row>
            </div>

            <Row>
              <Col xs={12} sm={8}>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                  totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                  dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi
                  tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
                  quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                  Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur,
                  vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                </p>
              </Col>
            </Row>

            <CityInfo
              lat={educator.address.lat}
              lng={educator.address.lng}
            />

          </Grid>

        }


      </div>
    )
  }
}

School.propTypes = {
  activeCourse: PropTypes.number,
  currencyRates: PropTypes.object,
  dispatch: PropTypes.func,
  educator: PropTypes.object,
  error: PropTypes.object,
  courseSearch: PropTypes.object,
  host: PropTypes.object,
  loading: PropTypes.bool,
  newThread: PropTypes.object,
  uiCurrency: PropTypes.string,
  params: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
