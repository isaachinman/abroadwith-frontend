import { havelockBlue } from 'styles/colors'

const size = 25

export default {
  brand: {
    position: 'absolute',
    top: 6,
    right: 12.5,
    display: 'inline-block',
    width: size,
    height: size,
    backgroundSize: '80%',
    margin: '0 20px 0 0',
    borderRadius: `${size}/2`,
  },
  brandname: {
    textTransform: 'lowercase',
    color: havelockBlue,
    fontSize: '2.35rem',
    fontWeight: 600,
  },
}
