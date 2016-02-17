var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (

      <li className="collection-item avatar room" data-id={this.props.id}>
        <img src={this.props.img} alt="" className="circle"></img>
        <span className="title">{this.props.roomName}</span>
        <p className='light'>
          {this.props.bed}
          <br></br>
          Vacancy: {this.props.vacancies}
        </p>
        <div className="secondary-content input-field">
          <input type="text" className="validate no-margin room-price" placeholder='€70' defaultValue={this.props.price+this.props.currency} />
          <label className='active left'>Weekly rate</label>
        </div>
      </li>

    );
  }
});
