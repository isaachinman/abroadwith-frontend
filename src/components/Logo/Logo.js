// Absolute imports
import React from 'react'

// Relative imports
import styles from './Logo.styles'

// --------------------------------------------------------------------------------
// Logo Component
// Dumb (stateless)
// --------------------------------------------------------------------------------

export default function Logo(props) {

  const { componentStyle, size, color } = props // eslint-disable-line no-shadow

  const logoColor = color === 'blue' ? styles.blueLogo : styles.whiteLogo

  /* eslint-disable max-len */
  return (
    <span style={componentStyle}>
      <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
        width={size} height={size} viewBox='0 0 150.9 160.3' style={styles.svg} xmlSpace='preserve'
      >

        <path
          style={logoColor}
          d='M 125.6,16.800001 C 112.8,6.0000007 96.500001,6.5175778e-7 79.700001,6.5175778e-7 c -19.2,0 -36.7,7.70000004824222 -49.5,20.10000034824222 -2.500001,-5.5 -8.000001,-9.4 -14.400001,-9.4 -8.7,0 -15.8,7.1 -15.8,15.8 0,6.3 3.7000001,11.7 9.0000001,14.2 1.6999999,1 3.4999999,1.7 5.4999999,2 -3.8,8.7 -5.9999999,18.4 -5.9999999,28.5 0,9.9 1.9999999,19.5 5.8999999,28.500002 C 16.1,103.6 19.9,105.9 23.9,105.9 c 1.4,0 2.8,-0.3 4.2,-0.9 5.300001,-2.3 7.700001,-8.399999 5.400001,-13.699999 -2.8,-6.4 -4.200001,-13.2 -4.200001,-20.2 0,-27.8 22.600001,-50.4 50.400001,-50.4 11.9,0 23.399999,4.2 32.399999,11.8 4.4,3.7 11,3.1 14.7,-1.3 3.7,-4.2 3.2,-10.7 -1.2,-14.4 z'
        />

        <path
          style={logoColor}
          d='m 146.5,46.500001 c -2,-5.4 -8,-8.2 -13.4,-6.2 -5.4,2 -8.2,8 -6.2,13.4 2.1,5.6 3.1,11.5 3.1,17.5 0,3.6 -0.4,7 -1.1,10.4 -3.1,-3.1 -7.4,-5 -12.1,-5 -9.5,0 -17.099999,7.7 -17.099999,17.1 C 99.700001,101.3 104.7,107.8 111.5,110 c -8.7,7.2 -19.799999,11.5 -31.899999,11.5 -11,0 -21.5,-3.5 -30.3,-10.1 -4.6,-3.5 -11.1,-2.5 -14.6,2.1 -3.5,4.6 -2.5,11.1 2.1,14.6 12.4,9.4 27.2,14.3 42.8,14.3 4.4,0 8.7,-0.4 12.9,-1.2 6.7,5.8 -2.9,17.9 2.1,19.1 C 105.2,154.8 113.7,148.3 120.4,141.3 l 0,0 c 0,0 27.7,-24 29.90001,-61.999999 0.3,-2.7 0.5,-5.4 0.5,-8.1 0.1,-8.5 -1.4,-16.8 -4.30001,-24.7 z'
        />

      </svg>
    </span>
  )
  /* eslint-enable max-len */

}

Logo.propTypes = {
  componentStyle: React.PropTypes.object,
  size: React.PropTypes.number.isRequired,
  color: React.PropTypes.string.isRequired,
}
