import { headerBluePurple } from 'styles/colors'

export default {
  mainRow: {
    marginTop: 40,
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
    position: 'relative',
  },
  scrollMessages: {
    width: '100%',
    height: 'calc(100vh - 300px)',
    overflow: 'scroll',
  },
  messageForm: {
    width: 'calc(100% + 30px)',
    padding: 15,
    marginBottom: -15,
    marginLeft: -15,
    background: '#eee',
    borderRadius: '0 0 4px 4px',
    textAlign: 'right',
  },
  messageInput: {
    width: '100%',
    height: 60,
  },
  sendBtn: {
    marginTop: 5,
  },
  loadMoreLink: {
    float: 'left',
    padding: '0 0 20px 10px',
  },
  smallProfilePicture: {
    backgroundSize: 'cover',
    borderRadius: '50%',
    width: 45,
    maxWidth: '100%',
    height: 45,
    display: 'inline-block',
  },
}
