import { headerBluePurple } from 'styles/colors'

export default {
  h1Row: {
    marginTop: 20,
  },
  floatLeft: {
    float: 'left',
  },
  inboxContainer: {
    height: 'calc(100vh - 100px)',
    overflow: 'scroll',
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
    background: headerBluePurple,
    color: 'white',
  },
  messageRight: {
    background: '#e6e6e6',
  },
  caretLeft: {
    position: 'absolute',
    top: 7,
    left: -7,
    color: headerBluePurple,
    fontSize: 25,
  },
  caretRight: {
    position: 'absolute',
    top: 7,
    right: -7,
    color: '#e6e6e6',
    fontSize: 25,
  },
  threadContainer: {
    width: '100%',
    height: '100%',
    float: 'left',
  },
  thread: {
    width: '100%',
    height: 'calc(100% - 70px)',
    float: 'left',
    overflow: 'scroll',
  },
  messageForm: {
    position: 'absolute',
    width: 'calc(100% - 15px)',
    padding: 15,
    bottom: 0,
    left: 0,
    background: '#eee',
  },
  messageInput: {
    width: 'calc(100% - 100px)',
    height: 46,
  },
  sendBtn: {
    marginLeft: 5,
  },
  loadMoreLink: {
    float: 'left',
    padding: '0 0 20px 10px',
  },
}
