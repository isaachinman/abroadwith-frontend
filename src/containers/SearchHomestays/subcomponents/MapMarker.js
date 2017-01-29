// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { roomResultMouseEnter, roomResultMouseLeave } from 'redux/modules/ui/search/hoverables'
import Currencies from 'data/constants/Currencies'

// Relative imports
import styles from '../SearchHomestays.styles'

@connect(
  state => ({
    roomHovered: state.ui.hoverables.roomHovered,
  })
)
export default class MapMarker extends Component {

  shouldComponentUpdate = nextProps => {
    return (this.props.roomId === nextProps.roomHovered || (this.props.roomId === this.props.roomHovered && this.props.roomId !== nextProps.roomHovered))
  }

  handleMouseEnter = () => {
    const { dispatch, roomId } = this.props
    dispatch(roomResultMouseEnter(roomId))
  }

  handleMouseLeave = () => {
    const { dispatch, roomId } = this.props
    dispatch(roomResultMouseLeave(roomId))
  }

  render() {
    const { currency, price, roomId, roomHovered } = this.props
    console.log('how many MapMarkers are rendering')
    return (
      <div
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={styles.marker}
      >
        <div role='tooltip' className='homestay-map-marker top' style={{ display: 'block' }}>
          <div className='arrow' />
          <div className='homestay-map-marker-content' style={roomId === roomHovered ? styles.hoveredPopoverSmall : {}}>
            <span className='currency'>{Currencies[currency]}</span>{Math.ceil(price)}
          </div>
        </div>
      </div>

    )
  }
}

MapMarker.propTypes = {
  currency: PropTypes.string,
  dispatch: PropTypes.func,
  price: PropTypes.number,
  roomHovered: PropTypes.number,
  roomId: PropTypes.number,
}
