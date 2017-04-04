// Absolute imports
import React, { Component, PropTypes } from 'react'
import { BackgroundImage } from 'components'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import { Link } from 'react-router'
import { updateActiveCourse } from 'redux/modules/ui/search/courseSearch'
import Radium from 'radium'

// Relative imports
import styles from '../SearchCourses.styles'

@connect()
@Radium
export default class SmallResult extends Component {

  handleClick = () => this.props.dispatch(updateActiveCourse(this.props.result.courseId))

  render() {

    const { currency, result } = this.props
    const currencySymbol = Currencies[currency]

    return (
      <div
        key={result.roomId}
        style={styles.smallResult}
        className='small-result'
      >
        <Link onClick={this.handleClick} to={`/language-school/${result.educatorId}`} style={styles.overlayLink} />
        <div style={styles.searchResultPrice}>{currencySymbol}{(result.totalPrice).toFixed(2)}</div>
        <BackgroundImage
          maxWidth={250}
          src={result.educatorImage ? result.educatorImage : '/app/courses/default_course.jpg'}
          styles={styles.smallSearchResultImg}
        />
        <div style={styles.searchResultInfo}>
          <div style={styles.searchResultText}>
            <div style={styles.searchResultTitle}>
              {result.courseName}
            </div>
            <div style={styles.searchResultSubtitle}>
              {result.educatorName}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SmallResult.propTypes = {
  currency: PropTypes.string,
  dispatch: PropTypes.func,
  result: PropTypes.object,
}
