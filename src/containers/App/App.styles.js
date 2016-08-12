import { havelockBlue, bgGrey } from 'styles/colors'

const size = 25

export default {
  app: {
    backgroundColor: bgGrey,
  },
  brand: {
    position: `absolute`,
    top: 12.5,
    right: 12.5,
    display: `inline-block`,
    width: size,
    height: size,
    backgroundSize: `80%`,
    margin: `0 20px 0 0`,
    borderRadius: `${size}/2`,
  },
  brandname: {
    textTransform: `lowercase`,
    color: havelockBlue,
    fontSize: `2.35rem`,
    fontWeight: 600,
  },
  appContainer: {
    display: `flex`,
    minHeight: `100vh`,
    flexDirection: `column`,
  },
  appContent: {
    marginTop: 50,
    flex: `1`,
  },
  footer: {
    color: `white`,
    backgroundColor: havelockBlue,
    padding: 20,
  },
}
