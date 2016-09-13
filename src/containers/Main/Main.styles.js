import { havelockBlue, accentBg } from 'styles/colors'

export default {
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    background: havelockBlue,
    color: 'white',
    padding: '60px 0 0 0',
  },
  heroInputRow: {
    fontSize: '16px !important',
    width: '100%',
    background: 'rgba(50,50,50,0.65)',
    marginTop: 100,
    padding: 30,
  },
  h1: {
    fontSize: '6rem',
  },
  h2: {
    color: accentBg,
  },
  button: {
    marginTop: 50,
  },
  container: {
    maxWidth: '100vw',
    minHeight: 500,
    paddingTop: 50,
  },
  guestSelect: {
    borderRadius: 0,
    WebkitAppearance: 'none',
    padding: '0 20px 0 16px',
    lineHeight: '44px',
  },
  inputFieldLeft: {
    borderRadius: '6px 0 0 6px',
  },
  inputFieldMiddle: {
    borderRadius: 0,
  },
  inputFieldRight: {
    borderRadius: '0 6px 6px 0',
  },
  submitBtn: {
    height: 46,
    minWidth: 80,
  },
}
