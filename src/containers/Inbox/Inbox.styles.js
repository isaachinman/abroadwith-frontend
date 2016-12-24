import { havelockBlue } from 'styles/colors'

export default {
  inboxContainer: {
    height: 'calc(100vh - 80px)',
    overflow: 'scroll',
  },
  grid: {
    background: 'white',
    padding: '50px 0 0 0',
  },
  sidebar: {
    paddingRight: 0,
    borderRight: '1px solid #ddd',
  },
  sidebarCopy: {
    padding: '0 10px',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  sidebarDates: {
    fontSize: 12,
  },
  messageContainer: {
    width: 'calc(100% - 30px)',
    float: 'left',
    margin: '0 10px 20px 10px',
  },
  message: {
    padding: 10,
    borderRadius: 10,
  },
  messageLeft: {
    background: havelockBlue,
    color: 'white',
  },
  messageRight: {
    background: '#e6e6e6',
  },
  caretLeft: {
    position: 'absolute',
    top: 7,
    left: -7,
    color: havelockBlue,
    fontSize: 25,
  },
  caretRight: {
    position: 'absolute',
    top: 7,
    right: -7,
    color: '#e6e6e6',
    fontSize: 25,
  },
}
