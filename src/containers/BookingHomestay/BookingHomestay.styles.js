export default {
  grid: {
    position: 'relative',
  },
  contentContainer: {
    padding: '50px 30px',
    '@media (max-width: 767px)': {
      padding: 15,
    },
  },
  bg: {
    background: 'rgba(0,0,0,.02)',
    position: 'absolute',
    top: 0,
    left: 15,
    width: 'calc(100% - 30px)',
    height: '100%',
  },
}
