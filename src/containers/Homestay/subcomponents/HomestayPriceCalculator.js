// Absolute imports
import React, { Component, PropTypes } from 'react'
import { calculateHomestayPrice } from 'redux/modules/ui/search/homestaySearch'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import equal from 'deep-is'

@connect(
  (state, ownProps) => ({
    auth: state.auth,
    homestay: state.publicData.homestays[ownProps.homeID],
    homestaySearch: state.uiPersist.homestaySearch,
    uiCurrency: state.ui.currency.value,
    token: state.auth.token,
  })
)
export default class HomestayPriceCalculator extends Component {

  componentDidMount = () => this.calculatePrice(this.props.immersionForPriceCalculation)

  componentDidUpdate = prevProps => {

    const { homestaySearch, immersionForPriceCalculation, uiCurrency } = this.props

    if (!equal(homestaySearch.params, prevProps.homestaySearch.params) ||
        homestaySearch.activeRoom !== prevProps.homestaySearch.activeRoom ||
        immersionForPriceCalculation !== prevProps.immersionForPriceCalculation ||
        uiCurrency !== prevProps.uiCurrency
      ) {
      this.calculatePrice()
    }

  }

  calculatePrice = () => {

    const { dispatch, homestay, homestaySearch, immersionForPriceCalculation, token, uiCurrency } = this.props

    const calculationObject = {
      arrivalDate: homestaySearch.params.arrival,
      departureDate: homestaySearch.params.departure,
      guestCount: homestaySearch.params.guests,
      roomId: homestaySearch.activeRoom,
      stayId: homestay.data.immersions[immersionForPriceCalculation].id,
      currency: uiCurrency,
      serviceNames: [],
      settingNames: [],
      languageHostWillTeach: homestaySearch.params.language || homestay.data.stayAvailableLanguages[0],
      languageGuestWillTeach: immersionForPriceCalculation === 'tandem' ? homestay.data.immersions.tandem.languagesInterested[0].lang : null,
      weeklyHours: immersionForPriceCalculation === 'teacher' ? homestay.data.immersions.teacher.packages[0] : null,
    }

    dispatch(calculateHomestayPrice(token, calculationObject))

  }

  render() {

    const { homestaySearch, uiCurrency } = this.props

    return (
      <div>
        {!homestaySearch.price.loading ?
          <div>
            {homestaySearch.price.loaded &&
              <span>{Currencies[uiCurrency]}{homestaySearch.price.data}*</span>
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
  dispatch: PropTypes.func,
  homestay: PropTypes.object,
  homestaySearch: PropTypes.object,
  immersionForPriceCalculation: PropTypes.string,
  uiCurrency: PropTypes.string,
  token: PropTypes.string,
}
