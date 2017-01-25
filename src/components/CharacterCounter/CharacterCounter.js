// Imports
import React, { Component, PropTypes } from 'react'

// Styles
const styles = {
  counter: {
    height: 12,
    position: 'absolute',
    bottom: -12,
    right: 0,
    fontSize: 12,
    lineHeight: '12px',
  },
}

export default class CharacterCounter extends Component {

  state = {
    valueLength: null,
  }

  componentDidMount() {
    const input = this.container.firstChild
    const inputRender = () => { this.setState({ valueLength: input.value.length }) }
    input.addEventListener('input', inputRender)
    inputRender()
  }

  render() {

    const { valueLength } = this.state
    const { children } = this.props

    console.log(this)

    let maxLength = null

    if (['text', 'textarea'].includes(children.props.type) && children.props.maxLength) {
      maxLength = children.props.maxLength
    }

    return (
      <div ref={div => this.container = div}>
        {children}
        <span className='form-control-character-counter' style={styles.counter}>
          {maxLength && valueLength &&
            <span>{valueLength}/{maxLength}</span>
          }
        </span>
      </div>
    )
  }

}

CharacterCounter.propTypes = {
  children: PropTypes.element,
}
