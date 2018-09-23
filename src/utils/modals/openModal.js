import Immutable from 'seamless-immutable'

export default function openModal(_this, modalName) {

  const newState = Immutable(_this.state).setIn(['modals', modalName, 'open'], true)
  return () => _this.setState(newState)

}
