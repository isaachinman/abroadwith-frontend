import { darkBlue, headerPink } from 'styles/colors'

export default {
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: darkBlue,
    color: 'white',
    height: '60vh',
    minHeight: 340,
    marginBottom: 30,
  },
  heroTextContent: {
    maxWidth: 600,
    margin: '0 auto',
    paddingBottom: 40,
  },
  container: {
    maxWidth: '100vw',
    minHeight: 500,
    paddingTop: 50,
  },
  searchBtn: {
    background: headerPink,
    border: 'none',
    height: 60,
    borderRadius: '0 5px 5px 0',
    color: 'white',
    fontSize: 16,
    padding: '0 25px',
  },
  heroInputRow: {
    position: 'absolute',
    bottom: -30,
    margin: '0 auto',
    background: 'white',
    borderRadius: 5,
    boxShadow: '5px 5px 13px 0 rgba(0,0,0,0.15)',
  },
  relative: {
    position: 'relative',
  },
  centerAlign: {
    textAlign: 'center',
  },
  paddedGrid: {
    padding: '80px 0 30px 0',
  },
  immersionDescription: {
    minHeight: 160,
  },
  immersionBtn: {
    color: 'white',
    border: 'none',
    padding: '3px 15px',
  },
  hostBtnRow: {
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
  },
  hostBtn: {
    color: 'white',
    border: 'none',
    padding: '3px 15px',
    margin: '5px 10px',
  },
}
