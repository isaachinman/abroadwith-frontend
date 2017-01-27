import { darkBlue, headerPink, warmPurple } from 'styles/colors'

export default {
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(http://i.imgur.com/jCJPALs.jpg)',
    backgroundSize: 'cover',
    '@media (max-width: 515px)': {
      paddingTop: 40,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    backgroundColor: darkBlue,
    color: 'white',
    height: '60vh',
    minHeight: 340,
    marginBottom: 30,
  },
  heroTextContent: {
    maxWidth: 600,
    margin: '0 auto',
    paddingBottom: 40,
    textShadow: '1px 2px 2px rgba(0, 0, 0, .2)',
  },
  searchBtn: {
    background: headerPink,
    border: 'none',
    height: 60,
    borderRadius: '0 5px 5px 0',
    color: 'white',
    fontSize: 16,
    padding: '0 25px',
  },
  heroInputRow: {
    position: 'absolute',
    bottom: -30,
    margin: '0 auto',
    background: 'white',
    borderRadius: 5,
    boxShadow: '5px 5px 13px 0 rgba(0,0,0,0.15)',
  },
  immersionPanel: {
    maxWidth: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  relative: {
    position: 'relative',
  },
  centerAlign: {
    textAlign: 'center',
  },
  paddedGrid: {
    padding: '100px 15px 40px 15px',
  },
  immersionDescription: {
    minHeight: 160,
  },
  immersionBtn: {
    color: 'white',
    border: 'none',
    padding: '3px 15px',
  },
  hostBtnRow: {
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
  },
  hostBtn: {
    color: 'white',
    border: 'none',
    padding: '3px 15px',
    margin: '5px 10px',
  },
  bigNumber: {
    fontSize: 64,
    color: warmPurple,
  },
  howItWorksBox: {
    marginBottom: 30,
  },
  howItWorksImage: {
    width: 300,
    margin: '0 0 20px 0',
    padding: 10,
  },
}
