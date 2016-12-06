// Absolute imports
import React, { Component, PropTypes } from 'react'
import { DropdownButton, InputGroup, MenuItem, Well } from 'react-bootstrap'
import i18n from 'i18n/i18n-client'
import { Typeahead } from 'react-bootstrap-typeahead'
import memobind from 'memobind'
import { translate } from 'react-i18next'

// Relative imports
import styles from './ManageLanguages.styles.js'

@translate()
export default class ManageLanguages extends Component {

  state = {
    learningLanguages: [
      {
        lang: null,
        level: null,
      },
    ],
    knownLanguages: [
      {
        lang: null,
        level: null,
      },
    ],
  }

  addKnownLanguage = () => {
    this.setState({
      knownLanguages: this.state.learningLanguages.concat([
        {
          lang: null,
          level: null,
        },
      ]),
    })
  }

  addLearningLanguage = () => {
    this.setState({
      learningLanguages: this.state.learningLanguages.concat([
        {
          lang: null,
          level: null,
        },
      ]),
    })
  }

  removeLearningLanguage = langIndex => {
    console.log(langIndex)
    const newLearningLanguages = this.state.learningLanguages.filter(lang => {
      return this.state.learningLanguages.indexOf(lang) !== langIndex
    })
    this.setState({
      learningLanguages: newLearningLanguages,
    })
  }

  render() {

    const {
      learningLanguages,
      knownLanguages,
    } = this.state

    const {
      t,
    } = this.props
    const languageOptions = Object.entries(i18n.store.data[i18n.language].translation.languages).map(([id, label]) => ({ id, label }))

    return (

      <div>
        <Well>
          <div style={styles.languageSectionHeader}>{t('common.languages_learning')}</div>
          {learningLanguages.map(lang => {
            return (
              <div style={styles.container}>
                <div style={styles.textInput}>
                  <Typeahead
                    options={languageOptions}
                  />
                </div>
                <div style={styles.proficiencySelect}>
                  <DropdownButton
                    style={styles.select}
                    componentClass={InputGroup.Button}
                    id='input-dropdown-addon'
                    title={t('common.choose_a_level')}
                  >
                    <MenuItem key='BEGINNER'>{t('common.learningLevels.BEGINNER')}</MenuItem>
                    <MenuItem key='INTERMEDIATE'>{t('common.learningLevels.INTERMEDIATE')}</MenuItem>
                    <MenuItem key='ADVANCED'>{t('common.learningLevels.ADVANCED')}</MenuItem>
                  </DropdownButton>
                </div>
                {learningLanguages.length > 1 &&
                  <div style={styles.removeLanguage} onClick={memobind(this, 'removeLearningLanguage', learningLanguages.indexOf(lang))}>X</div>
                }
              </div>
            )
          })}
          <div style={styles.addLanguage}>
            <a onClick={this.addLearningLanguage}>{t('common.add_another_language')}</a>
          </div>
        </Well>

        <Well>
          <div style={styles.languageSectionHeader}>{t('common.languages_known')}</div>
          {knownLanguages.map(() => {
            return (
              <div style={styles.container}>
                <div style={styles.textInput}>
                  <Typeahead
                    options={languageOptions}
                  />
                </div>
                <div style={styles.proficiencySelect}>

                  <DropdownButton
                    style={styles.select}
                    componentClass={InputGroup.Button}
                    id='input-dropdown-addon'
                    title={t('common.choose_a_level')}
                  >
                    <MenuItem key='NATIVE'>{t('common.knownLevels.NATIVE')}</MenuItem>
                    <MenuItem key='PROFICIENT'>{t('common.knownLevels.PROFICIENT')}</MenuItem>
                  </DropdownButton>

                </div>
                {knownLanguages.length > 1 &&
                  <div style={styles.removeLanguage}>X</div>
                }
              </div>
            )
          })}
          <div style={styles.addLanguage}>
            <a onClick={this.addKnownLanguage}>{t('common.add_another_language')}</a>
          </div>
        </Well>

      </div>

    )
  }
}

ManageLanguages.propTypes = {
  learningLevels: PropTypes.bool,
  knownLevels: PropTypes.bool,
  t: PropTypes.func,
}
