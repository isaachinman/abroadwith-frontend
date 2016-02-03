var React = require('react');

module.exports = React.createClass({
  render: function() {

    if (this.props.pricing) {
      var currency = this.props.pricing.currency;
      var oneMonthDiscount = this.props.pricing.discounts.oneMonthDiscount + '%';
      var threeMonthDiscount = this.props.pricing.discounts.threeMonthDiscount + '%';
      var sixMonthDiscount = this.props.pricing.discounts.sixMonthDiscount + '%';
      var extraGuest = this.props.pricing.extras.EXTRA_GUEST;
      var fullBoard = this.props.pricing.extras.FULL_BOARD;
      var halfBoard = this.props.pricing.extras.HALF_BOARD;
      var laundry = this.props.pricing.extras.LAUNDRY;
      var cleaning = this.props.pricing.extras.CLEANING;
      var airportPickup = this.props.pricing.extras.AIRPORT_PICKUP;
    }

    return (

      <div id="pricing" className="col s12 m10 offset-m1 l10 offset-l1">

        <div className='manage-home-block'>

          <div className='row'>
            <h4>Define your pricing</h4>
          </div>

          <div className='manage-home-section'>

            <div className='row section'>
              <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                <i className="fa fa-credit-card fa-2x"></i>
              </div>
              <div className='col s10 m2 l2 input-field'>
                <select className='material' value={currency}>
                  <option value="eur">EUR</option>
                  <option value="usd">USD</option>
                  <option value="gbp">GBP</option>
                </select>
                <label>Currency</label>
              </div>

              <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                <i className="fa fa-calendar-o fa-2x"></i>
              </div>
              <div className='col s2 m2 l2 left-align input-field'>
                <input type="text" className="validate no-margin" placeholder='5%' value={oneMonthDiscount} />
                <label className='active'>1 month discount</label>
              </div>
              <div className='col s2 m2 l2 left-align input-field'>
                <input type="text" className="validate no-margin" placeholder='7%' value={threeMonthDiscount} />
                <label className='active'>3 month discount</label>
              </div>
              <div className='col s2 m2 l2 left-align input-field'>
                <input type="text" className="validate no-margin" placeholder='14%' value={sixMonthDiscount} />
                <label className='active'>6+ month discount</label>
              </div>
            </div>

            <div className='divider'></div>

            <div className='row section'>

              <div className='col s12 m12 l6 left-align'>

                <label>Room rates (weekly)</label>
                <ul className="collection">
                  <li className="collection-item avatar">
                    <img src="https://www.hochschober.com/fileadmin/_processed_/csm__DSC9095_ced629437d.jpg" alt="" className="circle"></img>
                    <span className="title">Master bedroom</span>
                    <p className='light'>
                      Double bed
                      <br></br>
                      Vacancy: 2
                    </p>
                    <div className="secondary-content input-field">
                      <input type="text" className="validate no-margin" placeholder='€70' />
                      <label className='active'>Weekly rate</label>
                    </div>
                  </li>
                  <li className="collection-item avatar">
                    <img src="http://www.carnival.com/~/media/Images/explore/staterooms/room-type-tiles/interior-cruise-room.ashx" alt="" className="circle"></img>
                    <span className="title">Kids room</span>
                    <p className='light'>
                      Single bed
                      <br></br>
                      Vacancy: 2
                    </p>
                    <div className="secondary-content input-field">
                      <input type="text" className="validate no-margin" placeholder='€50' />
                      <label className='active'>Weekly rate</label>
                    </div>
                  </li>
                </ul>

                <label>Tandem discounts</label>
                <ul className="collection with-header extra-charges-collection">

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-circle-o-notch fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='20%' />
                        <label className='active'>Spanish discount</label>
                      </div>
                    </div>
                  </li>

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-circle-o-notch fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='10%' />
                        <label className='active'>German discount</label>
                      </div>
                    </div>
                  </li>

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-circle-o-notch fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='30%' />
                        <label className='active'>Swedish discount</label>
                      </div>
                    </div>
                  </li>

                </ul>

              </div>

              <div className='col s12 m12 l6 left-align'>
                <label>Extra charges</label>

                <ul className="collection with-header extra-charges-collection">

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-user-plus fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='€20' value={extraGuest} />
                        <label className='active'>Extra guest charge</label>
                      </div>
                    </div>
                  </li>

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-cutlery fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='€20' value={fullBoard} />
                        <label className='active'>Full board price</label>
                      </div>
                    </div>
                  </li>

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-adjust fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='€20' value={halfBoard} />
                        <label className='active'>Half board price</label>
                      </div>
                    </div>
                  </li>

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-shopping-basket fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='€20' value={laundry} />
                        <label className='active'>Laundry service price</label>
                      </div>
                    </div>
                  </li>

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-trash-o fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='€20' value={cleaning} />
                        <label className='active'>Cleaning service price</label>
                      </div>
                    </div>
                  </li>

                  <li className="collection-header col s12 m6 l6 border-right">
                    <div className='row'>
                      <div className='col s3 input-field center-align grey-text text-lighten-1'>
                        <i className="fa fa-plane fa-2x"></i>
                      </div>
                      <div className='col s9 input-field'>
                        <input type="text" className="validate no-margin" placeholder='€20' value={airportPickup} />
                        <label className='active'>Airport pickup price</label>
                      </div>
                    </div>
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>

        <div className='row'>
          <div className='col s6 offset-s3'>
            <a id='pricing-save' className='btn btn-primary save-btn'>Save</a>
          </div>
          <div className='col s3 right-align'>
            <a><i className="fa fa-chevron-right grey-text text-lighten-1 save-btn"></i></a>
          </div>
        </div>

      </div>


    );
  }
});
