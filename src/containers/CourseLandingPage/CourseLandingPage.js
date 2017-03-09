// Absolute imports
import React, { Component, PropTypes } from 'react'
import { babyBlue, freshGreen, saturatedPurple } from 'styles/colors'
import { BackgroundColorBlock, InlineSearchUnit, Testimonial } from 'components'
import { Button, Col, Grid, Panel, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import equal from 'deep-is'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import Masonry from 'react-masonry-component'
import { translate } from 'react-i18next'
import Radium from 'radium'
import { scrollToTopOfPage } from 'utils/scrolling'

// Relative imports
import styles from './CourseLandingPage.styles'

// Popular cities
const popularCities = ['barcelona', 'berlin', 'dublin', 'london', 'madrid', 'sevilla']

@connect(state => ({
  homestaySearch: state.uiPersist.homestaySearch,
  jwt: state.auth.jwt,
  uiLanguage: state.ui.locale.value,
  user: state.privateData.user,
  token: state.auth.token,
}))
@translate()
@Radium
export default class CourseLandingPage extends Component {

  state = {
    howDoesItWorkModalOpen: false,
  }

  componentDidMount = () => scrollToTopOfPage()

  shouldComponentUpdate = (nextProps, nextState) => {
    if (!equal(this.props, nextProps) || !equal(this.state, nextState)) {
      return true
    }
    return false
  }

  openHowDoesItWorkModal = () => this.setState({ howDoesItWorkModalOpen: true })
  closeHowDoesItWorkModal = () => this.setState({ howDoesItWorkModalOpen: false })

  // redirectToSearchWithImmersionType = type => {
  //   const { dispatch, homestaySearch } = this.props
  //   const params = Object.assign({}, homestaySearch.params)
  //   params.immersions[type] = true
  //   dispatch(performRoomSearch(params, push))
  // }

  render() {

    const { t } = this.props

    return (
      <div>

        <Helmet
          title={t('courses_landing_page.title')}
          meta={[
            { name: 'description', content: t('courses_landing_page.meta_description') },
          ]}
        />
        <div style={styles.hero}>

          <Grid style={styles.heroTextContent}>
            <Row>
              <Col xs={12}>
                <h1 style={styles.h1}>{t('courses_landing_page.h1')}</h1>
                <h5>{t('courses_landing_page.h2')}</h5>
              </Col>
            </Row>
          </Grid>

          <div style={styles.heroInputRow}>
            <InlineSearchUnit standalone shadow />
          </div>

        </div>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row style={{ marginBottom: 50 }}>
              <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2} lg={6} lgOffset={3}>
                <h3 className='header-green' style={styles.centerAlign}>{t('courses_landing_page.popular_cities.title')}</h3>
              </Col>
            </Row>
            <Row>
              <Masonry
                elementType={'ul'}
                options={{ transitionDuration: 0 }}
                style={{ listStyle: 'none' }}
              >
                {popularCities.map(city => {
                  return (
                    <li key={city} style={styles.popularCityPanel}>
                      <Panel>
                        <h4>{city}</h4>
                      </Panel>
                    </li>
                  )
                })}
              </Masonry>
            </Row>
          </Grid>
          <BackgroundColorBlock color={freshGreen} minHeight={300} />
        </div>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row style={{ marginBottom: 60, textAlign: 'center' }}>
              <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2} lg={6} lgOffset={3}>
                <h3 className='header-blue'>{t('testimonials.title')}</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={10} smOffset={1} lg={8} lgOffset={2}>
                <Testimonial
                  type='student'
                  person='brian'
                />
                <Testimonial
                  type='student'
                  person='giulia'
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} style={styles.hostBtnRow}>
                <Link to='/testimonials'>
                  <Button bsSize='xsmall' style={Object.assign({}, styles.hostBtn, { background: saturatedPurple })} >{t('common.see_more_testimonials')}</Button>
                </Link>
              </Col>
            </Row>
            <BackgroundColorBlock color={babyBlue} minHeight={320} />
          </Grid>
        </div>
        <div style={{ marginBottom: -20 }} />
      </div>
    )
  }
}

CourseLandingPage.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func,
}
