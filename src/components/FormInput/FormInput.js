import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, FormControl, InputGroup, FormGroup, HelpBlock } from 'react-bootstrap'
import { validatePassword } from 'utils/validation'
import isEmail from 'validator/lib/isEmail'
import Radium from 'radium'
import MDSpinner from 'react-md-spinner'

const styles = {
  spinner: {
    right: 15,
    top: 37,
    position: 'absolute',
  },
}

@Radium
export default class FormInput extends Component {
  state = {
    valid: null,
  }

  getValidationState = () => {
    const { validationState, isValid } = this.props
    if (validationState) {
      return validationState
    }

    if (isValid !== null && isValid !== undefined) {
      return isValid ? 'success' : 'error'
    }

    return false
  }

  handleValidation({ minLength, value = null, type, func = null }) {
    if (this.props.children) {
      this.setState({ valid: func(value) })
      return
    }

    const validations = {
      types: {
        email: () => isEmail(value),
        password: () => validatePassword(value),
      },
      minLength: () => value !== null && value.length > minLength,
    }

    if (minLength) {
      this.setState({ valid: validations.minLength() })
      return
    }

    this.setState({
      valid: func === null && type !== null ? validations.types[type]() : func(value),
    })
  }

  handleValueChange(event) {
    const { id, onChange, onDebounce } = this.props

    if (onChange) {
      onChange({
        id,
        event: event && event.target ? event.target : event,
      })
    }

    if (onDebounce) {
      onDebounce(event.target)
    }
  }

  recursiveCloneChildren(children) {
    return React.Children.map(children, child => {
      const childProps = { onChange: (e) => this.handleValueChange(e) }
      childProps.children = this.recursiveCloneChildren(child.props.children)
      return React.cloneElement(child, { ...childProps })
    })
  }

  renderFeedback() {
    return <HelpBlock style={{ fontSize: 12.5 }}>{this.props[`${this.getValidationState()}Feedback`]}</HelpBlock>
  }

  render() {
    const {
      id,
      type = 'text',
      label,
      value,
      notRequired,
      disabled = false,
      colSm = 6,
      colXs = 12,
      isCurrency,
      placeholder,
      loading,
    } = this.props

    const form = !this.props.children ?
      (<span><FormControl
        componentClass={type === 'textarea' ? 'textarea' : undefined}
        style={{ resize: 'none' }}
        value={value || ''}
        placeholder={placeholder || label}
        onChange={(e) => this.handleValueChange(e)}
        disabled={disabled}
      />{ loading && <MDSpinner duration={700} style={styles.spinner} singleColor='#03a9f4' size={16} /> }<FormControl.Feedback />{this.renderFeedback()}</span>) : this.recursiveCloneChildren(this.props.children)

    return (
      <Col sm={colSm} xs={colXs}>
        <FormGroup
          controlId={id}
          validationState={this.getValidationState()}
        >
          <ControlLabel>{label}{!notRequired && <span>*</span>}</ControlLabel>
          { isCurrency ?
            <InputGroup>
              <InputGroup.Addon>$</InputGroup.Addon>

              { form }
            </InputGroup> : form
          }
        </FormGroup>
      </Col>
    )
  }
}

FormInput.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string || PropTypes.array,
  onChange: PropTypes.func,
  onDebounce: PropTypes.func,
  validationState: PropTypes.string,
  successFeedback: PropTypes.string,
  customInput: PropTypes.object,
  children: PropTypes.element,
  notRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  minLength: PropTypes.number,
  validation: PropTypes.func,
  propChildrenValue: PropTypes.string,
  colSm: PropTypes.number,
  colXs: PropTypes.number,
  isCurrency: PropTypes.string,
  isValid: PropTypes.bool,
  loading: PropTypes.bool,
}
