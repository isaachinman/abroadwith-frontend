export default {
  grid: {
    position: 'relative',
  },
  pageSubtitle: {
    fontSize: 18,
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignRight: {
    textAlign: 'right',
  },
  bg: {
    background: 'rgba(0,0,0,.02)',
    position: 'absolute',
    top: 0,
    left: 15,
    width: 'calc(100% - 30px)',
    height: '100%',
  },
  heroContainer: {
    position: 'relative',
  },
  diagonal: {
    position: 'absolute',
    top: 460,
    left: 15,
    width: 280,
    height: 0,
    borderBottom: '40px solid #F5F5F5',
    borderRight: '60px solid transparent',
  },
  heroImage: {
    minHeight: 500,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
  },
  hostImage: {
    width: 180,
    height: 180,
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    top: 380,
    left: 30,
    boxShadow: '5px 5px 12px 0 rgba(0,0,0,0.15)',
  },
  stickyContainer: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: 270,
    textAlign: 'right',
    marginTop: -70,
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
  contentContainer: {
    width: 'calc(100% - 270px)',
    '@media (max-width: 767px)': {
      width: '100%',
      padding: '50px 5px',
    },
    display: 'inline-block',
    padding: '50px 30px',
  },
  borderBottom: {
    borderBottom: '1px solid #ddd',
  },
  borderBottomPadded: {
    borderBottom: '1px solid #ddd',
    paddingBottom: 15,
  },
  borderBottomPaddedTop: {
    borderBottom: '1px solid #ddd',
    paddingTop: 15,
  },
  bookNowBorderBottom: {
    borderBottom: '1px solid #eee',
    paddingBottom: 10,
  },
  mapContainer: {
    height: 300,
    paddingBottom: 15,
  },
  bookNowContainer: {
    textAlign: 'left',
  },
  bookNowButton: {
    marginBottom: 5,
  },
  roomImageContainer: {
    height: 200,
    lineHeight: '200px',
    textAlign: 'center',
    border: '1px solid #ddd',
    marginBottom: 15,
  },
  roomImage: {
    height: '100%',
    width: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  bedIcon: {
    fontSize: 80,
    lineHeight: '200px',
    color: '#ddd',
  },
  reviewCategory: {
    marginBottom: 15,
  },
  reviewContent: {
    minHeight: 60,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    margin: '0 auto',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  reviewPanel: {
    width: 'calc(100% - 65px)',
    marginLeft: 65,
    marginBottom: 30,
    position: 'relative',
    border: '1px solid #ddd',
    padding: 15,
    borderRadius: 5,
  },
  reviewerInfo: {
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    left: -65,
  },
  reviewCaretLeftInner: {
    position: 'absolute',
    zIndex: 2,
    top: 7,
    left: -9,
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderRight: '9px solid #F5F5F5',
    borderBottom: '8px solid transparent',
  },
  reviewCaretLeftOuter: {
    position: 'absolute',
    zIndex: 1,
    top: 5,
    left: -11,
    width: 0,
    height: 0,
    borderTop: '10.5px solid transparent',
    borderRight: '11px solid #ddd',
    borderBottom: '10.5px solid transparent',
  },
  centerAlign: {
    textAlign: 'center',
  },
  noBoxShadow: {
    boxShadow: 'none',
  },
  pricingDisclaimer: {
    opacity: 0.5,
    padding: '0 20px',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: '12px',
  },
  contactHostAlert: {
    marginTop: 15,
    textAlign: 'center',
  },
  sendMessageModalContentContainer: {
    padding: '15px 30px 30px 30px',
  },
}
