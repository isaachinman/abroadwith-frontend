import React from 'react'
import { DateRangePicker as DateRangePickerCore } from 'react-dates'

import styles from './DateRangePicker.styles.js'

export default class DateRangePicker extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      focusedInput: null,
      startDate: null,
      endDate: null,
    }

    this.onDatesChange = this.onDatesChange.bind(this)
    this.onFocusChange = this.onFocusChange.bind(this)
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate })
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput })
  }

  render() {

    const {
      inlineBlock,
      endDatePlaceholderText,
      startDatePlaceholderText,
    } = this.props

    const {
      focusedInput,
      startDate,
      endDate,
    } = this.state

    let combinedStyles = styles.base

    if (inlineBlock) {
      combinedStyles = Object.assign({}, combinedStyles, styles.inlineBlock)
    }

    return (
      <div style={combinedStyles}>
        <DateRangePickerCore
          {...this.props}
          orientation={this.props.orientation}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          startDatePlaceholderText={startDatePlaceholderText}
          endDatePlaceholderText={endDatePlaceholderText}
        />
      </div>
    )
  }
}

DateRangePicker.propTypes = {
  orientation: React.PropTypes.string,
  startDatePlaceholderText: React.PropTypes.string,
  endDatePlaceholderText: React.PropTypes.string,
  inlineBlock: React.PropTypes.bool,
  large: React.PropTypes.bool,
}
