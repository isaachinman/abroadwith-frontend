import { darkBlue, headerBluePurple, babyBlue } from 'styles/colors'

export default {
  grid: {
    padding: 0,
    position: 'relative',
  },
  controls: {
    zIndex: 98,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    '@media (max-width: 1199px)': {
      width: '100%',
    },
  },
  header: {
    margin: 0,
    display: 'inline-block',
    width: 'calc(100% - 100px)',
  },
  extrasContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 50,
  },
  extra: {
    userSelect: 'none',
    position: 'relative', // For popover positioning
    display: 'inline-block',
    height: 50,
    lineHeight: '50px',
    borderLeft: '1px solid rgba(250,250,250,.3)',
    padding: '0 10px',
    fontSize: 12,
    cursor: 'pointer',
  },
  headerBg: {
    background: babyBlue,
    color: 'white',
    width: '100%',
    padding: '9px 10px',
    maxHeight: 50,
  },
  resultScrollList: {
    height: 'calc(100vh - 195px)',
    width: '60%',
    '@media (max-width: 767px)': {
      width: '100%',
    },
    display: 'inline-block',
    verticalAlign: 'top',
    overflow: 'scroll',
    marginTop: 115,
    padding: '10px 10px 0 1px',
  },
  mapPanel: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '40%',
    height: 'calc(100vh - 80px)',
  },
  mapContainer: {
    height: 'calc(100vh - 80px)',
    position: 'relative',
  },
  searchResult: {
    background: 'white',
    marginBottom: 10,
    position: 'relative',
    width: 'calc(50% - 5px)',
    '@media (max-width: 991px)': {
      display: 'block',
      width: '100%',
      maxWidth: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    display: 'inline-block',
    borderRadius: 5,
  },
  searchResultCarouselImg: {
    backgroundSize: 'cover',
    width: '100%',
    height: 160,
  },
  searchResultPrice: {
    zIndex: 9,
    background: headerBluePurple,
    color: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '3px 10px',
    fontSize: 14,
    fontWeight: 'bold',
  },
  perWeek: {
    fontWeight: 'normal',
    fontSize: 12,
  },
  searchResultBottomHalf: {
    borderRight: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    borderLeft: '1px solid #ddd',
  },
  searchResultHostImg: {
    pointerEvents: 'none',
    width: 80,
    height: 80,
    backgroundSize: 'cover',
    position: 'absolute',
    right: 10,
    top: 120,
    borderRadius: 5,
  },
  searchResultRating: {
    position: 'absolute',
    right: 10,
    top: 213,
    fontSize: 12,
    color: headerBluePurple,
  },
  searchResultText: {
    padding: 10,
    maxWidth: 'calc(100% - 80px)',
    color: darkBlue,
  },
  searchResultSubtitle: {
    fontSize: 12,
  },
  overlayLink: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  inlineSearchUnit: {
    width: '100%',
    background: '#fafafa',
  },
  noResults: {
    background: '#eee',
    padding: 40,
  },
  resultListMinHeight: {
    minHeight: 'calc(100vh - 280px)',
  },
  pagination: {
    textAlign: 'center',
  },
}
