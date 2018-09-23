import { bodyTextColor, darkBlue, headerBluePurple, headerGreen } from 'styles/colors'

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
    '@media (max-width: 500px)': {
      display: 'none',
    },
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
    background: headerGreen,
    color: 'white',
    width: '100%',
    padding: '9px 10px',
    maxHeight: 50,
    '@media (max-width: 500px)': {
      display: 'none',
    },
  },
  resultScrollList: {
    height: 'calc(100vh - 195px)',
    width: '60%',
    '@media (max-width: 767px)': {
      width: '100%',
      padding: '20px 5px 0 5px',
    },
    '@media (max-width: 500px)': {
      marginTop: 70,
      height: 'calc(100vh - 150px)',
    },
    display: 'inline-block',
    verticalAlign: 'top',
    overflow: 'scroll',
    marginTop: 115,
    padding: '20px 20px 0 1px',
  },
  mapPanel: {
    position: 'relative',
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
    verticalAlign: 'top',
    background: 'white',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
    display: 'inline-block',
    border: '1px solid #ddd',
  },
  searchResultImg: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: 200,
  },
  smallSearchResultImg: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: 160,
  },
  resultCol: {
    padding: 0,
  },
  searchResultPrice: {
    zIndex: 57,
    background: headerGreen,
    color: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '3px 10px',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchResultRating: {
    position: 'absolute',
    right: 10,
    top: 12,
    fontSize: 12,
    color: headerBluePurple,
  },
  searchResultText: {
    padding: '10px 10px 5px 10px',
    color: darkBlue,
  },
  searchResultTitle: {
    fontSize: 17,
    maxWidth: 'calc(100% - 90px)',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'capitalize',
  },
  searchResultSubtitle: {
    fontSize: 13,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  overlayLink: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 55,
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
    minHeight: 'calc(100vh - 245px)',
  },
  resultDescription: {
    fontSize: 14,
    margin: '10px 0',
    minHeight: 57,
    color: bodyTextColor,
  },
  resultDates: {
    margin: '5px 0 15px 0',
  },
}
