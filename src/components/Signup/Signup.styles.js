import { accentGrey1, accentGrey3 } from 'styles/colors'

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
  paddedRow: {
    paddingBottom: 15,
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
}
