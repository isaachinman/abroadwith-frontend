// Imports
import React, { Component, PropTypes } from 'react'

// Styles
const styles = {
  counter: {
    height: 11,
    position: 'absolute',
    bottom: -12,
    right: 0,
    fontSize: 11,
    lineHeight: '11px',
    color: '#C0C0C0',
  },
}

export default class CharacterCounter extends Component {

  state = {
    valueLength: null,
  }

  componentDidMount() {
    const input = this.container.firstChild
    console.log('input: ', input)
    const inputRender = () => { this.setState({ valueLength: input.value.length }) }
    input.addEventListener('keyup', inputRender)
    inputRender()
  }

  render() {

    console.log(this)

    const { valueLength } = this.state
    const { children } = this.props
    const maxLength = (children.props.type === 'text' || children.props.componentClass === 'textarea') && children.props.maxLength ? children.props.maxLength : false

    return (
      <div ref={div => this.container = div}>
        {children}
        <span className='form-control-character-counter' style={styles.counter}>
          {valueLength && maxLength &&
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
