export default {
  grid: {
    position: 'relative',
    marginBottom: -20,
  },
  contentContainer: {
    background: 'rgba(255,255,255,.65)',
    padding: 30,
    minHeight: '100vh',
    borderLeft: '1px solid #eee',
    borderRight: '1px solid #eee',
    '@media (max-width: 767px)': {
      padding: 15,
    },
  },
  minHeightContainer: {
    minHeight: 500,
  },
  stepContainer: {
    marginBottom: 10,
    '@media (max-width: 991px)': {
      display: 'none',
    },
  },
  h1Row: {
    marginBottom: 50,
  },
}
