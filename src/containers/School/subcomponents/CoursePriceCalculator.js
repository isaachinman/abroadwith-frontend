// Absolute imports
import React, { Component, PropTypes } from 'react'
import { calculateCoursePrice } from 'redux/modules/ui/search/courseSearch'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import equal from 'deep-is'
import { uiDate } from 'utils/dates'
import { translate } from 'react-i18next'

@connect(
  (state, ownProps) => ({
    auth: state.auth,
    courseSearch: state.uiPersist.courseSearch,
    homestay: state.publicData.homestays[ownProps.homeID],
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
export default class HomestayPriceCalculator extends Component {

  componentDidMount = () => this.calculatePrice(this.props.immersionForPriceCalculation)

  componentDidUpdate = prevProps => {

    const { courseSearch, immersionForPriceCalculation, uiCurrency } = this.props

    if (!equal(courseSearch.params, prevProps.courseSearch.params) ||
        courseSearch.activeCourse !== prevProps.courseSearch.activeCourse ||
        immersionForPriceCalculation !== prevProps.immersionForPriceCalculation ||
        uiCurrency !== prevProps.uiCurrency
      ) {
      this.calculatePrice()
    }

  }

  calculatePrice = () => {

    const { dispatch, courseSearch, uiCurrency } = this.props

    if (courseSearch.activeCourse && courseSearch.params.arrival && courseSearch.params.departure) {

      const calculationObject = {
        courseId: courseSearch.activeCourse,
        startDate: courseSearch.params.arrival,
        endDate: courseSearch.params.departure,
        currency: uiCurrency,
      }

      dispatch(calculateCoursePrice(calculationObject))

    }
  }

  render() {

    const { courseSearch, t, uiCurrency } = this.props

    let priceResult = null

    if (courseSearch.price.loaded && courseSearch.price.data.results && courseSearch.price.data.results.length > 0) {
      priceResult = courseSearch.price.data.results[0]
    }

    return (
      <div>
        {!courseSearch.price.loading ?
          <div>
            {priceResult &&
              <div>
                <div className='text-muted'>
                  <small>{t('booking.result_start')}: <span className='pull-right'>{uiDate(priceResult.startDate)}</span></small>
                </div>
                <div className='text-muted'>
                  <small>{t('booking.result_end')}: <span className='pull-right'>{uiDate(priceResult.endDate)}</span></small>
                </div>
                <p style={{ marginTop: 10 }}>
                  {t('booking.total_price')}: <span className='pull-right'>{Currencies[uiCurrency]}{(priceResult.totalPrice).toFixed(2)}*</span>
                </p>
              </div>
            }
          </div>
          :
          <div className='pull-right'>
            -
          </div>
        }
      </div>
    )
  }
}

HomestayPriceCalculator.propTypes = {
  auth: PropTypes.object,
  dispatch: PropTypes.func,
  homestay: PropTypes.object,
  courseSearch: PropTypes.object,
  immersionForPriceCalculation: PropTypes.string,
  t: PropTypes.func,
  uiCurrency: PropTypes.string,
}
