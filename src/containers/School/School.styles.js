export default {
  grid: {
    position: 'relative',
  },
  headerRow: {
    color: 'white',
    textShadow: '1px 2px 2px rgba(0, 0, 0, .15)',
    padding: '30px 30px 10px 30px',
    marginBottom: 0,
  },
  bg: {
    background: 'rgba(0,0,0,.02)',
    position: 'absolute',
    top: 0,
    left: 15,
    width: 'calc(100% - 30px)',
    height: '100%',
  },
  contentContainer: {
    width: 'calc(100% - 270px)',
    '@media (max-width: 767px)': {
      width: '100%',
      padding: '50px 5px',
    },
    padding: '90px 15px 15px 15px',
    display: 'inline-block',
  },
  stickyContainer: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: 270,
    textAlign: 'right',
    marginTop: 134,
    paddingRight: 15,
    '@media (max-width: 767px)': {
      marginTop: 0,
      textAlign: 'center',
      width: '100%',
    },
  },
  panel: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: 260,
  },
  educatorMainImg: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: 200,
    opacity: 0.9,
    margin: '10px 0 20px 0',
  },
  cityImg: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: 300,
    margin: '15px 0',
    borderRadius: 5,
  },
  tabTitle: {
    margin: 0,
    padding: '0 5px',
  },
  tabContentContainer: {
    background: 'white',
    padding: '30px 15px',
    borderRight: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    borderLeft: '1px solid #ddd',
    borderRadius: '0 0 4px 4px',
  },
  reviewContent: {
    minHeight: 60,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    margin: '0 auto',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  reviewPanel: {
    width: 'calc(100% - 65px)',
    marginLeft: 65,
    marginBottom: 50,
    position: 'relative',
    padding: '0 15px',
  },
  reviewerInfo: {
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    left: -65,
    width: 60,
  },
  reviewerName: {
    fontSize: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
  },
  mapContainer: {
    height: 300,
    paddingBottom: 15,
  },
  result: {
    borderRadius: 5,
    overflow: 'hidden',
    background: 'rgba(0,0,0,.065)',
    transition: 'opacity .2s',
    margin: '15px 0',
  },
  educatorImage: {
    width: '100%',
    minHeight: 178, // Account for border top and bottom of 1px each
    backgroundSize: 'cover',
  },
  imageCol: {
    paddingLeft: 0,
    transition: 'width .35s',
  },
  courseName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  widthTransition: {
    transition: 'width .35s',
  },
  resultDetails: {
    padding: '15px 0',
  },
  coursePrice: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: '13px',
  },
  ratingNumber: {
    fontSize: 11,
    lineHeight: '1.1em',
  },
  rightAlign: {
    textAlign: 'right',
  },
  truncatedDescription: {
    minHeight: 44,
  },
  fullInfoLink: {
    marginTop: 5,
  },
  moreInfoTabs: {
    marginTop: 15,
  },
  courseTabContent: {
    padding: '15px 5px 5px 5px',
    background: 'white',
    borderLeft: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  bottomRow: {
    marginTop: 23,
  },
  omittedResult: {
    pointerEvents: 'none',
    opacity: 0.35,
  },
}
