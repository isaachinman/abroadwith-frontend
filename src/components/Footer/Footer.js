// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ContactUsForm } from 'components'
import { Grid, Modal, FormControl } from 'react-bootstrap'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { changeCurrency } from 'redux/modules/ui/currency'
import { changeLocale } from 'redux/modules/ui/locale'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'
import Radium from 'radium'
import UILanguages from 'data/constants/UILanguages'

// Relative imports
import styles from './Footer.styles'

@connect(state => {
  return {
    locale: state.ui.locale,
    currency: state.ui.currency,
  }
})
@translate()
@Radium
export default class Footer extends Component {

  state = {
    contactModalOpen: false,
  }

  openContactModal = () => this.setState({ contactModalOpen: true })
  closeContactModal = () => this.setState({ contactModalOpen: false })

  changeUICurrency = e => {
    this.props.dispatch(changeCurrency(e.target.value, true))
  }

  changeUILanguage = e => {
    this.props.dispatch(changeLocale(e.target.value, true))
  }

  render() {

    const {
      compact,
      t,
      locale,
      currency,
    } = this.props

    return (
      <footer style={styles.footer}>
        {!compact &&
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
        }
        <Grid style={compact ? Object.assign({}, styles.mainContent, styles.compactGrid) : styles.mainContent}>
          <div style={compact ? styles.flexContainerCompact : styles.flexContainer}>
            <div style={compact ? styles.flexChildCompact : styles.flexChild}>
              <div style={styles.relative}>
                <FormControl
                  onChange={this.changeUILanguage}
                  value={locale.value}
                  componentClass='select'
                  style={styles.select}
                >
                  {Object.keys(UILanguages).map(lang => {
                    return (
                      <option key={`uilang${lang}`} value={lang}>{UILanguages[lang].name}</option>
                    )
                  })}
                </FormControl>
                <FontAwesome style={styles.caretDown} name='caret-down' />
              </div>
              <div style={styles.relative}>
                <FormControl
                  onChange={this.changeUICurrency}
                  value={currency.value}
                  componentClass='select'
                  style={styles.select}
                >
                  <option value='EUR'>EUR</option>
                  <option value='USD'>USD</option>
                  <option value='GBP'>GBP</option>
                  <option value='CAD'>CAD</option>
                </FormControl>
                <FontAwesome style={styles.caretDown} name='caret-down' />
              </div>
            </div>
            <div style={compact ? styles.flexChildCompact : styles.flexChild}>
              <div onClick={this.openContactModal} style={styles.helpMeBtn}>
                {t('common.footer_help_me')} <FontAwesome name='comments' size='2x' style={styles.helpMeIcon} />
              </div>
            </div>
            <div style={compact ? styles.flexChildCompact : styles.flexChild} className='hidden-md hidden-lg'>
              <h6>{t('common.company')}</h6>
              <div><Link to='/abroadwith-for-students' style={styles.footerLink}>{t('common.footer_why_abroadwith')}</Link></div>
              <div><Link to='/host-international-students' style={styles.footerLink}>{t('common.footer_responsible_homestay')}</Link></div>
              <div><a href='//www.abroadwith-educators.com' style={styles.footerLink}>{t('common.footer_abroadwith_for_educators')}</a></div>
              <div><Link to='/popular-languages-destinations' style={styles.footerLink}>{t('common.footer_popular')}</Link></div>
            </div>
            <div style={compact ? styles.flexChildCompact : styles.flexChild}>
              <h6>{t('common.footer_host')}</h6>
              <div><Link to='/abroadwith-for-students' style={styles.footerLink}>{t('common.footer_why_abroadwith')}</Link></div>
              <div><Link to='/host-international-students' style={styles.footerLink}>{t('common.footer_responsible_homestay')}</Link></div>
              <div><a href='//www.abroadwith-educators.com' style={styles.footerLink}>{t('common.footer_abroadwith_for_educators')}</a></div>
              <div><Link to='/popular-languages-destinations' style={styles.footerLink}>{t('common.footer_popular')}</Link></div>
            </div>
            <div style={compact ? Object.assign({}, styles.flexChildCompact, styles.socialIconsCompact) : Object.assign({}, styles.flexChild, styles.socialIcons)}>
              <a href='//twitter.com/abroadwith_' style={styles.socialIcon} key='icon-twitter'>
                <FontAwesome name='twitter' size='2x' />
              </a>
              <a href='//www.pinterest.com/abroadwith_/' style={styles.socialIcon} key='icon-pinterest'>
                <FontAwesome name='pinterest' size='2x' />
              </a>
              <a href='//plus.google.com/u/0/b/117119459292667125359/117119459292667125359' style={styles.socialIcon} key='icon-google'>
                <FontAwesome name='google-plus' size='2x' />
              </a>
              <a href='//www.facebook.com/abroadwith/' style={styles.socialIcon} key='icon-facebook'>
                <FontAwesome name='facebook' size='2x' />
              </a>
            </div>
          </div>
        </Grid>
        <div style={styles.bottomRow}>
          <Grid style={compact ? styles.compactGrid : {}}>
            &copy; {moment().year()} Abroadwith
          </Grid>
        </div>
        <Modal show={this.state.contactModalOpen} onHide={this.closeContactModal}>
          <Modal.Body style={{ padding: 0, marginBottom: -22 }}>
            <ContactUsForm />
          </Modal.Body>
        </Modal>
      </footer>
    )
  }

}

Footer.propTypes = {
  compact: PropTypes.bool,
  currency: PropTypes.string,
  locale: PropTypes.string,
  t: PropTypes.func,
  dispatch: PropTypes.func,
}
