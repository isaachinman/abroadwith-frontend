var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');

var appElement = document.getElementById('how-does-it-work');

var App = React.createClass({
  getInitialState: function() {
    return { modalIsOpen: false };
  },
  openModal: function() {
    this.setState({modalIsOpen: true});
  },
  closeModal: function() {
    this.setState({modalIsOpen: false});
  },
  render: function() {
    return (
      <div>
        <button onClick={this.openModal} className='mdl-button mdl-js-button button--ghost button--white text-shadow'>How does it work?</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal} >

          <h2>Hello</h2>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
        </Modal>
      </div>
    );
  }
});

ReactDOM.render(<App/>, appElement);
