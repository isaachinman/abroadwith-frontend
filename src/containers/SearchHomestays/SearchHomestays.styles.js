import { headerGreen, babyBlue } from 'styles/colors'

export default {
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: babyBlue,
    height: 50,
    width: 'calc(100% + 15px)',
  },
  header: {
    position: 'absolute',
    left: 15,
    bottom: -25,
    background: 'white',
    color: headerGreen,
    padding: '0 30px',
    boxShadow: '5px 5px 12px 0 rgba(0,0,0,0.15)',
    borderRadius: 5,
  },
  interactionPanel: {
    position: 'relative',
    paddingTop: 80,
  },
  mapContainer: {
    height: 'calc(100vh - 80px)',
    position: 'relative',
  },
  searchIcon: {
    zIndex: 3,
    position: 'absolute',
    top: 17,
    left: 17,
    color: headerGreen,
  },
  searchBox: {
    zIndex: 2,
    position: 'absolute',
    top: 10,
    left: 8,
    paddingLeft: 30,
    width: 'calc(100% - 15px)',
  },
}
