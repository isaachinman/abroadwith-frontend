// Absolute imports
import React, { Component, PropTypes } from 'react'
import { DropdownButton, InputGroup, MenuItem, Well } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { translate } from 'react-i18next'
import i18n from 'i18n/i18n-client'

// Relative imports
import styles from './ManageLanguages.styles.js'

@translate()
export default class ManageLanguages extends Component {

  render() {

    const {
      addLanguage,
      availableLanguages,
      doNotCenterAlign,
      learningLanguages,
      knownLanguages,
      t,
      removeLanguage,
      updateLanguage,
      updateLanguageLevel,
      uiLanguage,
    } = this.props

    const i18nLanguage = i18n.language || uiLanguage
    const borderRadiusStyling = '.manage-language-module .bootstrap-typeahead-input-main { border-radius: 3px 0 0 3px; }'

    return (

      <div style={doNotCenterAlign ? Object.assign({}, styles.moduleContainer, { marginLeft: 0 }) : styles.moduleContainer} className='manage-language-module'>
        <style>{borderRadiusStyling}</style>
        <Well>
          <h6 className='header-green'>{t('common.languages_learning')}</h6>
          {learningLanguages.map(lang => {
            return (
              <div key={`learning${lang.id}`} style={styles.container}>
                <div style={styles.textInput}>
                  <Typeahead
                    selected={lang.language ? [i18n.store.data[i18nLanguage].translation.languages[lang.language]] : []}
                    onChange={data => updateLanguage('learning', lang.id, data)}
                    options={availableLanguages}
                  />
                </div>
                <div style={styles.proficiencySelect}>
                  <DropdownButton
                    id='learning-language-levels'
                    disabled={lang.language === null}
                    style={styles.select}
                    componentClass={InputGroup.Button}
                    onSelect={eventKey => updateLanguageLevel('learning', lang.id, eventKey)}
                    title={lang.level ? t(`common.learningLevels.${lang.level}`) : t('common.choose_a_level')}
                  >
                    <MenuItem eventKey='BEGINNER'>{t('common.learningLevels.BEGINNER')}</MenuItem>
                    <MenuItem eventKey='INTERMEDIATE'>{t('common.learningLevels.INTERMEDIATE')}</MenuItem>
                    <MenuItem eventKey='ADVANCED'>{t('common.learningLevels.ADVANCED')}</MenuItem>
                  </DropdownButton>
                </div>
                {learningLanguages.length > 1 &&
                  <div onClick={() => removeLanguage('learning', lang.id)} style={styles.removeLanguage}>&times;</div>
                }
              </div>
            )
          })}
          <div style={styles.addLanguage}>
            <a onClick={() => addLanguage('learning')}>{t('common.add_another_language')}</a>
          </div>
        </Well>

        <Well>
          <h6 className='header-green'>{t('common.languages_known')}</h6>
          {knownLanguages.map(lang => {
            return (
              <div key={`known${lang.id}`} style={styles.container}>
                <div style={styles.textInput}>
                  <Typeahead
                    selected={lang.language ? [i18n.store.data[i18nLanguage].translation.languages[lang.language]] : []}
                    onChange={data => updateLanguage('known', lang.id, data)}
                    options={availableLanguages}
                  />
                </div>
                <div style={styles.proficiencySelect}>

                  <DropdownButton
                    id='known-language-levels'
                    disabled={lang.language === null}
                    style={styles.select}
                    componentClass={InputGroup.Button}
                    onSelect={eventKey => updateLanguageLevel('known', lang.id, eventKey)}
                    title={lang.level ? t(`common.knownLevels.${lang.level}`) : t('common.choose_a_level')}
                  >
                    <MenuItem eventKey='NATIVE'>{t('common.knownLevels.NATIVE')}</MenuItem>
                    <MenuItem eventKey='PROFICIENT'>{t('common.knownLevels.PROFICIENT')}</MenuItem>
                  </DropdownButton>

                </div>
                {knownLanguages.length > 1 &&
                  <div onClick={() => removeLanguage('known', lang.id)} style={styles.removeLanguage}>&times;</div>
                }
              </div>
            )
          })}
          <div style={styles.addLanguage}>
            <a onClick={() => addLanguage('known')}>{t('common.add_another_language')}</a>
          </div>
        </Well>

      </div>

    )
  }
}

ManageLanguages.propTypes = {
  addLanguage: PropTypes.func,
  availableLanguages: PropTypes.array,
  controlled: PropTypes.bool,
  doNotCenterAlign: PropTypes.bool,
  learningLanguages: PropTypes.array,
  knownLanguages: PropTypes.array,
  learningLevels: PropTypes.bool,
  knownLevels: PropTypes.bool,
  removeLanguage: PropTypes.func,
  t: PropTypes.func,
  uiLanguage: PropTypes.string,
  updateLanguage: PropTypes.func,
  updateLanguageLevel: PropTypes.func,
}
