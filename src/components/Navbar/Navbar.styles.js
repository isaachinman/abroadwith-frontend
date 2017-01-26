import { darkBlue } from 'styles/colors'

export default {
  brandname: {
    textTransform: 'lowercase',
    color: darkBlue,
    fontSize: '2.35rem',
    fontWeight: 600,
  },
  mobileNavbar: {
    '@media (min-width: 767px)': {
      display: 'none',
    },
  },
  desktopNavbar: {
    '@media (max-width: 767px)': {
      display: 'none',
    },
  },
}
