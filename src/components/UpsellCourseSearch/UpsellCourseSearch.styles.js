export default {
  contentContainer: {
    paddingLeft: 15,
    paddingRight: 30,
  },
  result: {
    border: '1px solid #ddd',
    borderRadius: 5,
    overflow: 'hidden',
    background: 'rgba(255,255,255,.65)',
    transition: 'opacity .2s',
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
}
