export default {
  panel: {
    padding: 0,
    background: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    boxShadow: '5px 5px 12px 0 rgba(0,0,0,0.15)',
    margin: '0 15px 30px 15px',
  },
  mainInfo: {
    display: 'inline-block',
    width: 200,
    '@media (max-width: 767px)': {
      width: '100%',
    },
  },
  img: {
    maxWidth: '100%',
    '@media (max-width: 767px)': {
      width: '50%',
      display: 'inline-block',
    },
  },
  title: {
    padding: 20,
    '@media (max-width: 767px)': {
      width: '50%',
      display: 'inline-block',
    },
  },
  content: {
    borderLeft: '1px solid #eee',
    display: 'inline-block',
    verticalAlign: 'top',
    width: 'calc(100% - 200px)',
    padding: '10px 30px 30px 30px',
    '@media (max-width: 767px)': {
      width: '100%',
      borderLeft: 'none',
      borderTop: '1px solid #eee',
    },
  },
}
