import { accentGrey1, accentGrey3, warmPurple } from 'styles/colors'

export default {
  signupPanel: {
    padding: '10px 20px',
    textAlign: 'center',
  },
  signupMenu: {
    maxWidth: 300,
    padding: '40px 0',
    margin: '0 auto',
  },
  emailSignupBtn: {
    cursor: 'pointer',
    textDecoration: 'none',
  },
  emailSignupInput: {
    margin: '0 0 10px 0',
  },
  dividerContainer: {
    height: 50,
  },
  divider: {
    height: 20,
    borderBottom: `1px solid ${accentGrey1}`,
    textAlign: 'center',
  },
  dividerText: {
    fontSize: 14,
    color: accentGrey3,
    backgroundColor: 'white',
    padding: '0 10px',
    lineHeight: '35px',
  },
  nextBtn: {
    marginBottom: 20,
  },
  splashOfColour: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 165,
    background: warmPurple,
    borderRadius: '0 0 4px 4px',
  },
}
