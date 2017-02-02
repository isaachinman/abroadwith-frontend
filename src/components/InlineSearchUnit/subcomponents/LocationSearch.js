// Absolute imports
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { translate } from 'react-i18next'

@translate()
export default class LocationSearch extends Component {

  state = {
    value: null,
  }

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.refs.input) // eslint-disable-line
    this.searchBox = new google.maps.places.SearchBox(input) // eslint-disable-line
    this.searchBox.addListener('places_changed', this.onPlacesChanged)
  }

  componentWillReceiveProps = nextProps => {
    this.setState({ value: nextProps.defaultValue })
  }

  componentWillUnmount() {
    console.log('location search unmounting')
    if (typeof this.searchBox.removeListener === 'function') {
      console.log('removing event listener')
      this.searchBox.removeListener('places_changed', this.onPlacesChanged)
    }
  }

  onPlacesChanged = () => {
    console.log('places change called')
    this.props.handleValueChange('location', this.searchBox.getPlaces()[0])
  }

  /* eslint-disable */
  render() {

    const { integrated, t } = this.props

    return (
      <input
        onChange={event => this.setState({ value: event.target.value })}
        value={this.state.value || ''}
        placeholder={integrated ? t('common.where_mobile') : t('common.where')}
        ref='input'
        type='text'
        className='form-control location-search'
      />
    )
  }
  /* eslint-enable */

}

LocationSearch.propTypes = {
  defaultValue: PropTypes.string,
  handleValueChange: PropTypes.func,
  integrated: PropTypes.bool,
  t: PropTypes.func,
}
