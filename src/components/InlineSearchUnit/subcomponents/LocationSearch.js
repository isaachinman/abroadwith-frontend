// Absolute imports
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { translate } from 'react-i18next'

@translate()
export default class LocationSearch extends Component {

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.refs.input) // eslint-disable-line
    this.searchBox = new google.maps.places.SearchBox(input) // eslint-disable-line
    this.searchBox.addListener('places_changed', this.onPlacesChanged)
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

    const { defaultValue, t } = this.props

    return (
      <input defaultValue={defaultValue} placeholder={t('search.map_input_placeholder')} ref='input' type='text' className='form-control location-search' />
    )
  }
  /* eslint-enable */

}

LocationSearch.propTypes = {
  defaultValue: PropTypes.string,
  handleValueChange: PropTypes.func,
  t: PropTypes.func,
}
