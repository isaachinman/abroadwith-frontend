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

          <button onClick={this.closeModal} className='close'><i className='fa fa-times'></i></button>

          <div className='mdl-grid mdl-cell mdl-cell--12-col mdl-typography--text-center'>

            <h2>How does it work?</h2>

            <div className='mdl-grid mdl-cell mdl-cell--12-col'>
              <div className='mdl-cell mdl-cell--4-col'>
                <h5>Discover</h5>
                <div className='divider'></div>
                <i className="fa fa-globe fa-5x"></i>
                <div className='divider'></div>
                <p>
                  Choose between hundreds of cities and hosts. Find hosts with common interests to immerse in a new culture and language.
                </p>
              </div>
              <div className='mdl-cell mdl-cell--4-col'>
                <h5>Book an immersion programme</h5>
                <div className='divider'></div>
                <i className="fa fa-language fa-5x"></i>
                <div className='divider'></div>
                <p>
                  Pick a program: <strong>stay</strong>, <strong>tandem</strong> and <strong>teacher’s stay</strong>. Connect with our hosts, confirm your dates and book your stay.
                </p>
              </div>
              <div className='mdl-cell mdl-cell--4-col'>
                <h5>Book a language course</h5>
                <div className='divider'></div>
                <i className="fa fa-graduation-cap fa-5x"></i>
                <div className='divider'></div>
                <p>Optionally book a language course close to your new home. Decide how many hours and what level suits you. Travel to your new destination, learn, immerse and enjoy.</p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
});

ReactDOM.render(<App/>, appElement);
