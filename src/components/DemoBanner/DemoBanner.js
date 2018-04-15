import React from 'react'

const styles = {
  banner: {
    width: 300,
    height: 50,
    lineHeight: '50px',
    position: 'fixed',
    bottom: 50,
    right: -80,
    zIndex: 99999,
    backgroundColor: '#FC5050',
    transform: 'rotate(-45deg)',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
}

export default class DemoBanner extends React.Component {

  render() {
    return (
      <div style={styles.banner}>Demo Only</div>
    )
  }
}
