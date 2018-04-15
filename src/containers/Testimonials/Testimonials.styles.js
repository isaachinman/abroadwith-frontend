import config from 'config'
import { darkBlue } from 'styles/colors'

export default {
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_testimonials.jpeg)`,
    '@media (max-width: 1000px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_testimonials.jpeg?w=1000)`,
    },
    '@media (max-width: 600px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),url(${config.img}/app/hero/hero_testimonials.jpeg?w=600)`,
    },
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: darkBlue,
    color: 'white',
    height: '60vh',
    minHeight: 420,
    '@media (max-width: 350px)': {
      minHeight: 460,
    },
    marginBottom: 30,
  },
  heroTextContent: {
    maxWidth: 600,
    margin: '0 auto',
    textShadow: '1px 2px 2px rgba(0, 0, 0, .2)',
  },
  contentContainer: {
    padding: '60px 30px 30px 30px',
    borderLeft: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    background: 'white',
  },
}
