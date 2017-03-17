// Absolute imports
import React, { Component, PropTypes } from 'react'
import { calculateCoursePrice } from 'redux/modules/ui/search/courseSearch'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import equal from 'deep-is'

@connect(
  (state, ownProps) => ({
    auth: state.auth,
    courseSearch: state.uiPersist.courseSearch,
    homestay: state.publicData.homestays[ownProps.homeID],
    uiCurrency: state.ui.currency.value,
  })
)
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

    const { auth, dispatch, courseSearch, uiCurrency } = this.props

    const calculationObject = {
      courseId: courseSearch.activeCourse,
      startDate: courseSearch.params.arrival,
      endDate: courseSearch.params.departure,
      level: courseSearch.params.level,
      currency: uiCurrency,
    }

    dispatch(calculateCoursePrice(auth.token, calculationObject))

  }

  render() {

    const { courseSearch, uiCurrency } = this.props

    return (
      <div>
        {!courseSearch.price.loading ?
          <div>
            {courseSearch.price.loaded &&
              <span>{Currencies[uiCurrency]}{courseSearch.price.data}*</span>
            }
          </div>
          :
          <div>
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
  uiCurrency: PropTypes.string,
}
