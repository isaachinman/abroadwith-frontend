var React = require('react');
var ReactDOM = require('react-dom');
var i18n = require('../../global/components/i18n');

i18n.loadNamespaces('manage_home');

module.exports = React.createClass({
  deletePhoto: function() {

    // Send deletion request to API, then reload state upon success
    Materialize.toast(i18n.t('manage_home:photo_deleted_toast'), 4000);

  },
  render: function() {
    return (

      <div className="col s12 m6 l4">
        <div className="card home-photo">
          <div className="card-image">
            <img src={this.props.src}></img>
          </div>
          <a className='delete' onClick={this.deletePhoto}><i className="fa fa-times fa-2x"></i></a>
        </div>
      </div>

    );
  }
});
