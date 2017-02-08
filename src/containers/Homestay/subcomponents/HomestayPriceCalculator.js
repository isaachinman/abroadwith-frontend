// Absolute imports
import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect(
  (state, ownProps) => ({
    auth: state.auth,
    homestay: state.publicData.homestays[ownProps.homeID],
    homestaySearch: state.uiPersist.homestaySearch,
  })
)
export default class HomestayPriceCalculator extends Component {

  render() {

    console.log(this)

    return (
      <div>
        Price
      </div>
    )
  }
}
