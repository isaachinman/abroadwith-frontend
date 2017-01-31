// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { roomResultMouseEnter, roomResultMouseLeave, roomPopoverOpen } from 'redux/modules/ui/search/hoverables'
import Currencies from 'data/constants/Currencies'
import SmallResult from './SmallResult'

@connect(
  state => ({
    roomHovered: state.ui.hoverables.roomHovered,
    roomPopover: state.ui.hoverables.roomPopover,
  })
)
export default class MapMarker extends Component {

  shouldComponentUpdate = nextProps => {
    return ((this.props.roomId === nextProps.roomHovered || (this.props.roomId === this.props.roomHovered && this.props.roomId !== nextProps.roomHovered)) ||
            (this.props.roomId === nextProps.roomPopover || (this.props.roomId === this.props.roomPopover && this.props.roomId !== nextProps.roomPopover)))
  }

  handleClick = () => {
    const { dispatch, roomId } = this.props
    dispatch(roomPopoverOpen(roomId))
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

    const { currency, price, roomId, roomHovered, roomPopover } = this.props
    const hovered = roomId === roomHovered
    const popoverOpen = roomId === roomPopover

    const markerWidth = popoverOpen ? 250 : 40
    const markerHeight = popoverOpen ? 216 : 40
    let markerClass = 'homestay-map-marker top'

    if (hovered) {
      markerClass += ' hovered'
    }

    return (
      <span>
        {!popoverOpen &&
          <div
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            style={{
              position: 'absolute',
              width: markerWidth,
              height: markerHeight,
              left: -markerWidth / 2,
              top: -markerHeight / 2,
            }}
          >
            <div role='tooltip' className={markerClass} style={{ display: 'block' }}>
              <div className='arrow' />
              <div className='homestay-map-marker-content'>
                <span className='currency'>{Currencies[currency]}</span>{Math.ceil(price)}
              </div>
            </div>
          </div>
        }
        {popoverOpen &&
          <div
            style={{
              position: 'absolute',
              left: -markerWidth / 2,
              top: -markerHeight,
            }}
          >
            <div role='tooltip' className='homestay-map-marker top small-result' style={{ display: 'block' }}>
              <div className='arrow' />
              <div className='homestay-map-marker-content'>
                <SmallResult currency={currency} result={this.props} />
              </div>
            </div>
          </div>
        }
      </span>
    )
  }
}

MapMarker.propTypes = {
  currency: PropTypes.string,
  dispatch: PropTypes.func,
  price: PropTypes.number,
  roomHovered: PropTypes.number,
  roomId: PropTypes.number,
  roomPopover: PropTypes.number,
}
