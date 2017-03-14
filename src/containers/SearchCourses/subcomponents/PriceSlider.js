// Absolute imports
import React, { Component, PropTypes } from 'react'
import Currencies from 'data/constants/Currencies'
import Slider from 'rc-slider'
import { Popover } from 'react-bootstrap'
import { translate } from 'react-i18next'

// Styles
const styles = {
  sliderContainer: {
    padding: '10px 50px 10px 10px',
    minWidth: 300,
  },
  priceDisplay: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    width: 20,
    textAlign: 'center',
  },
}

@translate()
export default class PriceSlider extends Component {

  render() {

    const { handlePriceChange, maxPrice, t, currency } = this.props

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
        id='price-slider-course-search'
      >
        <div style={styles.sliderContainer}>
          <h6 style={{ marginTop: 0 }}>{t('search.max_weekly_price')}</h6>
          <Slider
            tipFormatter={value => `${currencySymbol}${value}`}
            min={0}
            max={1000}
            defaultValue={maxPrice}
            onAfterChange={handlePriceChange}
          />
          <div style={Object.assign({}, styles.priceDisplay, { right: 30 })}>{currencySymbol}{maxPrice}</div>
        </div>
      </Popover>
    )
  }
}

PriceSlider.propTypes = {
  currency: PropTypes.string,
  handlePriceChange: PropTypes.func,
  t: PropTypes.func,
  maxPrice: PropTypes.number,
  uiCurrency: PropTypes.string,
}
