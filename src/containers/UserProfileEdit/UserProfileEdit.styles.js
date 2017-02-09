import { headerGreen, sunsetOrange } from 'styles/colors'

export default {
  grid: {
    position: 'relative',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  contentContainer: {
    padding: '50px 30px',
    '@media (max-width: 767px)': {
      padding: 15,
    },
  },
  bg: {
    background: 'rgba(0,0,0,.02)',
    position: 'absolute',
    top: 0,
    left: 15,
    width: 'calc(100% - 30px)',
    height: '100%',
  },
  topRow: {
    borderBottom: '1px solid #ddd',
  },
  h1: {
    display: 'inline-block',
    verticalAlign: 'bottom',
    width: 'calc(100% - 120px)',
  },
  profileImage: {
    width: 120,
    height: 120,
    display: 'inline-block',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    '@media (max-width: 767px)': {
      display: 'none',
    },
  },
  aboutMeParagraph: {
    marginTop: 10,
  },
  noBoxShadow: {
    boxShadow: 'none',
  },
  greenCheck: {
    color: headerGreen,
  },
  redTimes: {
    color: sunsetOrange,
  },
  languageMinWidth: {
    display: 'inline-block',
    minWidth: 120,
    '@media (max-width: 767px)': {
      width: '100%',
    },
  },
}
