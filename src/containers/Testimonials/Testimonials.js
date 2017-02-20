// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Nav, NavItem, Tab, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import Radium from 'radium'
import { scrollToTopOfPage } from 'utils/scrolling'
import { Testimonial } from 'components'
import { translate } from 'react-i18next'

// Relative imports
import styles from './Testimonials.styles'

@translate()
@Radium
export default class Testimonials extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {
    const { t } = this.props
    return (
      <div>
        <Helmet title={t('testimonials.title')} />
        <div style={styles.hero}>

          <Grid style={styles.heroTextContent}>
            <Row>
              <Col xs={12}>
                <h1>{t('testimonials.title')}</h1>
                <h5>{t('testimonials.subtitle')}</h5>
              </Col>
            </Row>
          </Grid>

        </div>
        <Grid>
          <Tab.Container id='testimonials' defaultActiveKey='students'>
            <Row>
              <Col xs={12}>
                <Nav bsStyle='tabs'>
                  <NavItem eventKey='students'>{t('testimonials.student_tab')}</NavItem>
                  <NavItem eventKey='hosts'>{t('testimonials.host_tab')}</NavItem>
                </Nav>
              </Col>
              <Col xs={12}>
                <Tab.Content style={styles.contentContainer}>
                  <Tab.Pane eventKey='students'>
                    <div>
                      <Testimonial person='daniel' type='student' />
                      <Testimonial person='isabel' type='student' />
                      <Testimonial person='oliver' type='student' />
                      <Testimonial person='marco' type='student' />
                      <Testimonial person='sue' type='student' />
                      <Testimonial person='francois' type='student' />
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey='hosts'>
                    <div>
                      <Testimonial person='esther' type='host' />
                      <Testimonial person='cathy' type='host' />
                      <Testimonial person='lola' type='host' />
                      <Testimonial person='julien' type='host' />
                      <Testimonial person='jonathan' type='host' />
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Grid>
      </div>
    )
  }
}

Testimonials.propTypes = {
  t: PropTypes.func,
}
