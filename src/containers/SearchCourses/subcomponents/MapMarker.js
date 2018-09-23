// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { courseResultMouseEnter, courseResultMouseLeave, coursePopoverOpen } from 'redux/modules/ui/search/hoverables'
import Currencies from 'data/constants/Currencies'
import SmallResult from './SmallResult'

@connect(
  state => ({
    courseHovered: state.ui.hoverables.courseHovered,
    coursePopover: state.ui.hoverables.coursePopover,
  })
)
export default class MapMarker extends Component {

  shouldComponentUpdate = nextProps => {
    return ((this.props.courseId === nextProps.courseHovered || (this.props.courseId === this.props.courseHovered && this.props.courseId !== nextProps.courseHovered)) ||
            (this.props.courseId === nextProps.coursePopover || (this.props.courseId === this.props.coursePopover && this.props.courseId !== nextProps.coursePopover)))
  }

  handleClick = () => {
    const { dispatch, courseId } = this.props
    dispatch(coursePopoverOpen(courseId))
  }

  handleMouseEnter = () => {
    const { dispatch, courseId } = this.props
    dispatch(courseResultMouseEnter(courseId))
  }

  handleMouseLeave = () => {
    const { dispatch, courseId } = this.props
    dispatch(courseResultMouseLeave(courseId))
  }

  render() {

    const { currency, totalPrice, courseId, courseHovered, coursePopover } = this.props
    const hovered = courseId === courseHovered
    const popoverOpen = courseId === coursePopover

    const markerWidth = popoverOpen ? 225 : 40
    const markerHeight = popoverOpen ? 210 : 40
    let markerClass = 'course-map-marker top'

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
                <span className='currency'>{Currencies[currency]}</span>{(totalPrice).toFixed(2)}
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
  totalPrice: PropTypes.number,
  courseHovered: PropTypes.number,
  courseId: PropTypes.number,
  coursePopover: PropTypes.number,
}
