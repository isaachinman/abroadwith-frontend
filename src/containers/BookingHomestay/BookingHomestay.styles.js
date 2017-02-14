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
    padding: '0 10px',
    '@media (max-width: 991px)': {
      display: 'none',
    },
  },
  h1Row: {
    marginBottom: 40,
  },
  pager: {
    marginLeft: -24,
    marginBottom: -24,
    width: 'calc(100% + 48px)',
  },
  homeImage: {
    minHeight: 200,
    margin: '-15px 0 15px -15px',
    width: 'calc(100% + 30px)',
    borderRadius: '4px 4px 0 0',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  widthTransition: {
    transition: 'width .5s',
  },
  overviewPanel: {
    boxShadow: 'none',
  },
  borderBottom: {
    borderBottom: '1px solid #ddd',
  },
  totalPriceLabel: {
    lineHeight: '32px',
  },
  totalPrice: {
    fontSize: 22,
  },
  servicesListContainer: {
    maxWidth: 'calc(100% - 80px)',
    display: 'inline-block',
    textAlign: 'right',
  },
}
