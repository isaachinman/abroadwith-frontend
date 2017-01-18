import React, { Component } from 'react'
import { DateRangePicker as DateRangePickerCore } from 'react-dates'

import styles from './DateRangePicker.styles.js'

export default class DateRangePicker extends Component {

  state = {
    focusedInput: null,
    startDate: null,
    endDate: null,
  }

  onFocusChange= (focusedInput) => {
    this.setState({ focusedInput })
  }

  render() {

    const {
      inlineBlock,
      large,
      endDatePlaceholderText,
      startDatePlaceholderText,
      startDate,
      onDatesChange,
      endDate,
    } = this.props

    const {
      focusedInput,
    } = this.state

    // --------------------------------------------------------------------------------
    // This is our standardised method of applying conditional styles
    // --------------------------------------------------------------------------------
    let combinedStyles = styles.base
    const styleVariations = {
      inlineBlock,
    }
    Object.keys(styleVariations).forEach(variation => {
      if (styleVariations[variation]) {
        combinedStyles = Object.assign({}, combinedStyles, styles[variation])
      }
    })

    return (
      <div style={combinedStyles} className={large ? 'daterangepicker-large' : ''}>
        <DateRangePickerCore
          {...this.props}
          orientation={this.props.orientation}
          onDatesChange={onDatesChange}
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
  endDate: React.PropTypes.object,
  orientation: React.PropTypes.string,
  onDatesChange: React.PropTypes.func,
  startDate: React.PropTypes.object,
  startDatePlaceholderText: React.PropTypes.string,
  endDatePlaceholderText: React.PropTypes.string,
  inlineBlock: React.PropTypes.bool,
  large: React.PropTypes.bool,
}
