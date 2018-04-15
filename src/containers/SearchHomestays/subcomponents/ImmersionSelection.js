// Absolute imports
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import FontAwesome from 'react-fontawesome'
import i18n from 'i18n/i18n-client'
import Switch from 'antd/lib/switch'
import { translate } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'
import { OverlayTrigger, Tooltip, Popover } from 'react-bootstrap'


// Styles
const styles = {
  container: {
    width: 220,
  },
  immersionRow: {
    padding: '2px 10px 0 10px',
    borderRadius: 4,
    borderBottom: '1px solid #ddd',
  },
  immersionRowBottom: {
    padding: '2px 10px 0 10px',
    borderRadius: 4,
  },
  immersionLabel: {
    display: 'inline-block',
    width: 120,
  },
  immersionSwitch: {
    textAlign: 'right',
    display: 'inline-block',
    width: 80,
  },
  tandemLanguage: {
    marginBottom: 10,
    fontSize: 12,
  },
  questionMark: {
    fontSize: 11,
    margin: '0 5px',
    paddingTop: 4,
    color: 'rgba(0,0,0,.35)',
    verticalAlign: 'top',
  },
}

@translate()
export default class ImmersionSelection extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {

    const { handleTandemLanguageChange, immersions, uiLanguage, t, tandemLanguage, toggleImmersion } = this.props

    // Popover props passed along
    const { arrowOffsetLeft, arrowOffsetTop, className, placement, positionLeft, positionTop, style } = this.props // eslint-disable-line

    console.log('toggle: ', immersions)

    return (
      <Popover
        arrowOffsetLeft={arrowOffsetLeft}
        arrowOffsetTop={arrowOffsetTop}
        className={className}
        placement={placement}
        positionLeft={positionLeft}
        positionTop={positionTop}
        style={Object.assign({}, style, { padding: 0 })}
        id='immersion-selection-homestay-search'
      >
        <div style={styles.container}>

          <div style={styles.immersionRow}>
            <div style={styles.immersionLabel}>
              <h6>
                {t('common.Stay')}
                <OverlayTrigger placement='top' overlay={<Tooltip id='stay_description_tooltip'>{t('common.stay_description_tooltip')}</Tooltip>}>
                  <FontAwesome name='question-circle' style={styles.questionMark} className='text-muted' />
                </OverlayTrigger>
              </h6>
            </div>
            <div style={styles.immersionSwitch}>
              <Switch
                defaultChecked={immersions.stay}
                onChange={value => setTimeout(() => toggleImmersion('stay', value), 250)}
              />
            </div>
          </div>

          <div style={styles.immersionRow}>
            <div style={styles.immersionLabel}>
              <h6>
                {t('common.Tandem')}
                <OverlayTrigger placement='top' overlay={<Tooltip id='tandem_description_tooltip'>{t('common.tandem_description_tooltip')}</Tooltip>}>
                  <FontAwesome name='question-circle' style={styles.questionMark} className='text-muted' />
                </OverlayTrigger>
              </h6>
            </div>
            <div style={styles.immersionSwitch}>
              <Switch
                defaultChecked={immersions.tandem}
                onChange={value => setTimeout(() => toggleImmersion('tandem', value), 250)}
              />
            </div>
            {immersions.tandem &&
              <div style={styles.tandemLanguage}>
                <Typeahead
                  selected={tandemLanguage ? [{ label: t(`languages.${tandemLanguage}`), id: tandemLanguage }] : []}
                  placeholder={t('search.your_tandem_language')}
                  options={Object.entries(i18n.store.data[uiLanguage].translation.languages).map(([id, label]) => ({ id, label }))}
                  onChange={options => {
                    return options[0] ? handleTandemLanguageChange(options[0].id) : handleTandemLanguageChange(null)
                  }}
                />
              </div>
            }
          </div>

          <div style={styles.immersionRowBottom}>
            <div style={styles.immersionLabel}>
              <h6>
                {t('common.Teacher')}
                <OverlayTrigger placement='top' overlay={<Tooltip id='teacher_description_tooltip'>{t('common.teacher_description_tooltip')}</Tooltip>}>
                  <FontAwesome name='question-circle' style={styles.questionMark} className='text-muted' />
                </OverlayTrigger>
              </h6>
            </div>
            <div style={styles.immersionSwitch}>
              <Switch
                defaultChecked={immersions.teacher}
                onChange={value => setTimeout(() => toggleImmersion('teacher', value), 250)}
              />
            </div>
          </div>

        </div>
      </Popover>
    )
  }
}

ImmersionSelection.propTypes = {
  immersions: PropTypes.object,
  uiLanguage: PropTypes.string,
  t: PropTypes.func,
  tandemLanguage: PropTypes.string,
  toggleImmersion: PropTypes.func,
  handleTandemLanguageChange: PropTypes.func,
}
