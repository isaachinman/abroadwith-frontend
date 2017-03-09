import config from 'config'
import { darkBlue } from 'styles/colors'

export default {
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(${config.img}/app/hero/hero_v2_courses_landing_page.jpg)`,
    '@media (max-width: 1000px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(${config.img}/app/hero/hero_v2_courses_landing_page.jpg?w=1000)`,
    },
    '@media (max-width: 600px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(${config.img}/app/hero/hero_v2_courses_landing_page.jpg?w=600)`,
    },
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundColor: darkBlue,
    backgroundPosition: 'center',
    '@media (max-width: 515px)': {
      paddingTop: 40,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    color: 'white',
    height: '60vh',
    minHeight: 420,
    '@media (max-width: 350px)': {
      minHeight: 460,
    },
    marginBottom: 30,
  },
  heroTextContent: {
    maxWidth: 600,
    margin: '0 auto',
    textShadow: '1px 2px 2px rgba(0, 0, 0, .2)',
  },
  heroInputRow: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    width: '100%',
    textAlign: 'center',
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
  popularCityContainer: {
    padding: '15px 15px 0 15px',
  },
  popularCityPanel: {
    position: 'relative',
    maxWidth: 400,
    padding: 0,
    border: 'none',
  },
  popularCityImg: {
    position: 'relative',
    zIndex: 0,
    maxWidth: '100%',
    borderRadius: 3,
    marginBottom: -1,
  },
  popularCityImgMask: {
    borderRadius: 3,
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(50,50,50,.15)',
  },
  popularCityTitle: {
    color: 'white',
    position: 'absolute',
    zIndex: 2,
    top: 'calc(50% - 40px)',
    left: 0,
    width: '100%',
    textAlign: 'center',
    textShadow: '1px 2px 2px rgba(0, 0, 0, .6)',
  },
}
