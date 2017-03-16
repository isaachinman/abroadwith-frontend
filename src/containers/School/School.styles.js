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
    padding: '90px 15px 30px 15px',
    display: 'inline-block',
  },
  stickyContainer: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: 270,
    textAlign: 'right',
    marginTop: -30,
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
    minHeight: 300,
    opacity: 0.9,
    margin: '10px 0 20px 0',
  },
  tabTitle: {
    margin: 0,
    padding: '0 5px',
  },
  tabContentContainer: {
    padding: 15,
    borderRight: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    borderLeft: '1px solid #ddd',
    borderRadius: '0 0 4px 4px',
  },
}
