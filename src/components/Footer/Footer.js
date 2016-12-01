// Absolute imports
import { Col, Grid, Row, FormControl } from 'react-bootstrap'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { changeCurrency } from 'redux/modules/ui/currency'
import { changeLocale } from 'redux/modules/ui/locale'

// Relative imports
import styles from './Footer.styles'

@connect(state => {
  return {
    locale: state.ui.locale,
    currency: state.ui.currency,
  }
})
export default class Footer extends Component {

  changeUICurrency = e => {
    this.props.dispatch(changeCurrency(e.target.value, true))
  }

  changeUILanguage = e => {
    this.props.dispatch(changeLocale(e.target.value, true))
  }

  render() {

    const {
      locale,
      currency,
    } = this.props

    return (
      <footer style={styles.footer}>
        <Grid style={styles.mainContent}>
          <Row>
            <Col xs={4}>
              UI Language
              <FormControl onChange={this.changeUILanguage} value={locale.value} componentClass='select' placeholder='select'>
                <option value='en'>en</option>
                <option value='es'>es</option>
                <option value='de'>de</option>
              </FormControl>
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
            Bottom row
          </Grid>
        </div>
      </footer>
    )
  }

}

Footer.propTypes = {
  currency: PropTypes.string,
  locale: PropTypes.string,
  dispatch: PropTypes.func,
}
