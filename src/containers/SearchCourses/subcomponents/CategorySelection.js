// Absolute imports
import React, { Component, PropTypes } from 'react'
import CourseCategories from 'data/constants/CourseCategories'
import shallowCompare from 'react-addons-shallow-compare'
import { translate } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Popover } from 'react-bootstrap'

// Styles
const styles = {
  container: {
    padding: 15,
    width: 260,
  },
}

@translate()
export default class CategorySelection extends Component {

  componentDidMount = () => this.refs.typeahead.getInstance().focus() // eslint-disable-line

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {

    const { categories, handleCategoryChange, language, t } = this.props

    // Popover props passed along
    const { arrowOffsetLeft, arrowOffsetTop, className, placement, positionLeft, positionTop, style } = this.props // eslint-disable-line

    // Determine course categories based on language
    const courseCategories = []

    if (['ENG', 'DEU', 'SPA'].includes(language)) {
      // Add language specific categories first
      CourseCategories[language].map(category => courseCategories.push({ value: category, label: t(`course_categories.${category}`) }))
    }

    // Now add all general categories
    CourseCategories.GENERAL.map(category => courseCategories.push({ value: category, label: t(`course_categories.${category}`) }))


    return (
      <Popover
        arrowOffsetLeft={arrowOffsetLeft}
        arrowOffsetTop={arrowOffsetTop}
        className={className}
        placement={placement}
        positionLeft={positionLeft}
        positionTop={positionTop}
        style={Object.assign({}, style, { padding: 0 })}
        id='category-selection-course-search'
      >
        <div style={styles.container}>

          {/* eslint-disable */}
          <Typeahead
            ref='typeahead'
            multiple
            selected={categories.map(category => ({ value: category, label: t(`course_categories.${category}`) }))}
            placeholder={t('booking.course_categories')}
            options={courseCategories}
            onChange={options => {
              return options[0] ? handleCategoryChange(options) : handleCategoryChange([])
            }}
          />

        </div>
      </Popover>
    )
  }
}

CategorySelection.propTypes = {
  t: PropTypes.func,
  categories: PropTypes.array,
  handleCategoryChange: PropTypes.func,
  language: PropTypes.string,
}
