// Absolute imports
import React, { Component, PropTypes } from 'react'
import Slider from 'rc-slider'
import { Popover } from 'react-bootstrap'
import Currencies from 'data/constants/Currencies'


// Styles
const styles = {
  sliderContainer: {
    padding: '10px 35px',
    minWidth: 300,
  },
  priceDisplay: {
    position: 'absolute',
    top: 20,
    fontSize: 12,
    width: 20,
    textAlign: 'center',
  },
}

export default class PriceSlider extends Component {

  handleChange = value => {
    if (value && value.length === 2) {
      this.props.handlePriceChange(value[0], value[1])
    }
  }

  render() {

    const { minPrice, maxPrice, currency } = this.props

    // Popover props passed along
    const { arrowOffsetLeft, arrowOffsetTop, className, placement, positionLeft, positionTop, style } = this.props // eslint-disable-line

    const currencySymbol = Currencies[currency]
    console.log(this)

    return (
      <Popover
        arrowOffsetLeft={arrowOffsetLeft}
        arrowOffsetTop={arrowOffsetTop}
        className={className}
        placement={placement}
        positionLeft={positionLeft}
        positionTop={positionTop}
        style={Object.assign({}, style, { maxWidth: 'none' })}
        id='price-slider-homestay-search'
      >
        <div style={styles.sliderContainer}>
          <div style={Object.assign({}, styles.priceDisplay, { left: 10 })}>{currencySymbol}{minPrice}</div>
          <Slider
            range
            tipFormatter={value => `${currencySymbol}${value}`}
            min={0}
            max={600}
            defaultValue={[minPrice, maxPrice]}
            onAfterChange={this.handleChange}
          />
          <div style={Object.assign({}, styles.priceDisplay, { right: 15 })}>{currencySymbol}{maxPrice}</div>
        </div>
      </Popover>
    )
  }
}

PriceSlider.propTypes = {
  currency: PropTypes.string,
  handlePriceChange: PropTypes.func,
  t: PropTypes.func,
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  uiCurrency: PropTypes.string,
}
