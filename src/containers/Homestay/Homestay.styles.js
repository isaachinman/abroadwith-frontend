export default {
  grid: {
    position: 'relative',
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
    width: 300,
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
  },
  panel: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: 240,
    height: 300,
  },
  contentContainer: {
    width: 'calc(100% - 270px)',
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
}
