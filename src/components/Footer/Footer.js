// Absolute imports
import { Col, Grid, Row, FormControl } from 'react-bootstrap'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { changeCurrency } from 'redux/modules/ui/currency'
import { changeLocale } from 'redux/modules/ui/locale'
import moment from 'moment'

// Relative imports
import styles from './Footer.styles'

@connect(state => {
  return {
    locale: state.ui.locale,
    currency: state.ui.currency,
  }
})
@translate()
export default class Footer extends Component {

  changeUICurrency = e => {
    this.props.dispatch(changeCurrency(e.target.value, true))
  }

  changeUILanguage = e => {
    this.props.dispatch(changeLocale(e.target.value, true))
  }

  render() {

    const {
      t,
      locale,
      currency,
    } = this.props

    return (
      <footer style={styles.footer}>
        <div style={styles.topRow}>
          <Grid>
            <Link to='/about' style={styles.topLink}>{t('common.About')}</Link>
            <a href='//blog.abroadwith.com' style={styles.topLink}>{t('common.Blog')}</a>
            <a href='//jobs.abroadwith.com' style={styles.topLink}>{t('common.Jobs')}</a>
            <a href='//press.abroadwith.com' style={styles.topLink}>{t('common.Press')}</a>
            <Link to='/privacy' style={styles.topLink}>{t('common.Policies')}</Link>
            <Link to='/terms' style={styles.topLink}>{t('common.terms_and_conditions')}</Link>
            <Link to='/contact-us' style={styles.topLink}>{t('common.contact')}</Link>
          </Grid>
        </div>
        <Grid style={styles.mainContent}>
          <Row>
            <Col xs={12} sm={4}>
              UI Language
              <FormControl onChange={this.changeUILanguage} value={locale.value} componentClass='select' placeholder='select'>
                <option value='en'>en</option>
                <option value='es'>es</option>
                <option value='de'>de</option>
              </FormControl>
            </Col>
            <Col xs={12} sm={4}>
              <Link to='/privacy'>
                <span>Privacy</span>
              </Link>
              <Link to='/terms'>
                <span>Terms & Conditions</span>
              </Link>
              <Link to='/faq'>
                <span>FAQ</span>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              UI Currency
              <FormControl onChange={this.changeUICurrency} value={currency.value} componentClass='select' placeholder='select'>
                <option value='EUR'>EUR</option>
                <option value='USD'>USD</option>
                <option value='GBP'>GBP</option>
                <option value='CAD'>CAD</option>
              </FormControl>
            </Col>
          </Row>
        </Grid>
        <div style={styles.bottomRow}>
          <Grid>
            &copy; {moment().year()} Abroadwith
          </Grid>
        </div>
      </footer>
    )
  }

}

Footer.propTypes = {
  currency: PropTypes.string,
  locale: PropTypes.string,
  t: PropTypes.func,
  dispatch: PropTypes.func,
}
