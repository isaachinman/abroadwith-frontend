var React = require('react');
var RoomPriceModule = require('./room-price-module.react')
var TandemDiscountModule = require('./tandem-discount-module.react')

module.exports = React.createClass({
  handleClick: function() {

    // If user has rooms
    if (this.props.rooms) {

      // Create new rooms object
      newRoomObj = this.props.rooms;

      function changePrice( id, price ) {
         for (var i in newRoomObj) {
           if (newRoomObj[i].id == id) {
              newRoomObj[i].price = price;
              break;
           }
         }
      }

      $('li.room').each(function() {

        var id = $(this).attr('data-id');
        var price = $(this).find('.room-price').val();
        changePrice(id, price);

      })

      // Modify home object, using new rooms object
      if (typeof homeObj !== 'undefined') {
        homeObj.rooms = newRoomObj;
      }

    }

    // If user has tandems
    if (this.props.immersions.tandem) {

      // Create new rooms object
      newTandemObj = this.props.immersions.tandem.languagesInterested;

      function changeDiscount(lang, discount) {
         for (var i in newTandemObj) {
           if (newTandemObj[i].lang == lang) {
              newTandemObj[i].discount = discount;
              break;
           }
         }
      }

      $('li.tandem-discount').each(function() {

        var lang = $(this).find('input.discount').attr('data-lang');
        var discount = $(this).find('input.discount').val();
        changeDiscount(lang, discount);

      })

      // Modify home object, using new rooms object
      if (typeof homeObj !== 'undefined') {
        homeObj.immersions.tandem.languagesInterested = newTandemObj;
      }

    }

    // Create new pricing object
    if (this.props.pricing) {

      var newPricingObj = [];
      newPricingObj.discounts = {}
      newPricingObj.extras = {}

      newPricingObj.currency = $('select#currency').val();
      newPricingObj.discounts.oneMonthDiscount = $('input#one-month-discount').val();
      newPricingObj.discounts.threeMonthDiscount = $('input#three-month-discount').val();
      newPricingObj.discounts.sixMonthDiscount = $('input#six-month-discount').val();
      newPricingObj.extras.EXTRA_GUEST = $('input#extra-guest').val();
      newPricingObj.extras.FULL_BOARD = $('input#full-board').val();
      newPricingObj.extras.HALF_BOARD = $('input#half-board').val();
      newPricingObj.extras.LAUNDRY = $('input#laundry').val();
      newPricingObj.extras.CLEANING = $('input#cleaning').val();
      newPricingObj.extras.AIRPORT_PICKUP = $('input#airport-pickup').val();

      // Modify home object, using new pricing object
      if (typeof homeObj !== 'undefined') {
        homeObj.pricing = newPricingObj;
      }

    }

    console.log(homeObj)

    // POST new home object
    Materialize.toast('Pricing updated', 4000);

  },
  render: function() {

    // Set price vars
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

    // Create room modules if rooms exist
    var rooms = [];
    if (this.props.rooms && this.props.pricing) {

      this.props.rooms.forEach(function(obj) {
        var room = <RoomPriceModule
            id={obj.id}
            roomName={obj.name}
            bed={obj.bed}
            vacancies={obj.vacancies}
            img={obj.img}
            price={obj.price}
            currency={currency}
          />;
        rooms.push(room);
      })

    } else {

      function goToRoomsTab() {
        $('ul.tabs').tabs('select_tab', 'rooms');
      }

      rooms = <li className="collection-item"><span className="title">You haven't created any rooms</span><br></br><a className='light' onClick={goToRoomsTab}>Go to the "Rooms" tab and make your first room</a></li>

    }

    // Create tandem modules if immersions exist
    var tandemDiscounts = [];
    if (this.props.immersions) {

      this.props.immersions.tandem.languagesInterested.forEach(function(obj) {
        var tandem = <TandemDiscountModule
            lang={obj.lang}
            discount={obj.discount}
          />;
        tandemDiscounts.push(tandem);
      })

    } else {

      function goToImmersionsTab() {
        $('ul.tabs').tabs('select_tab', 'immersions');
      }

      tandemDiscounts = <li className="collection-item no-tandem"><span className="title">You haven't enabled tandem immersions</span><br></br><a className='light' onClick={goToImmersionsTab}>Go to the "Immersions" tab and update your preferences</a></li>

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
                <select id='currency' className='material' value={currency}>
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
                <input id='one-month-discount' type="text" className="validate no-margin" placeholder='5%' value={oneMonthDiscount} />
                <label className='active'>1 month discount</label>
              </div>
              <div className='col s2 m2 l2 left-align input-field'>
                <input id='three-month-discount' type="text" className="validate no-margin" placeholder='7%' value={threeMonthDiscount} />
                <label className='active'>3 month discount</label>
              </div>
              <div className='col s2 m2 l2 left-align input-field'>
                <input id='six-month-discount' type="text" className="validate no-margin" placeholder='14%' value={sixMonthDiscount} />
                <label className='active'>6+ month discount</label>
              </div>
            </div>

            <div className='divider'></div>

            <div className='row section'>

              <div className='col s12 m12 l6 left-align'>

                <label>Room rates (weekly)</label>

                <ul className="collection">

                  {rooms}

                </ul>

                <label>Tandem discounts</label>

                <ul className="collection with-header extra-charges-collection">

                  {tandemDiscounts}

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
                        <input id='extra-guest' type="text" className="validate no-margin" placeholder='€20' value={extraGuest} />
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
                        <input id='full-board' type="text" className="validate no-margin" placeholder='€20' value={fullBoard} />
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
                        <input id='half-board' type="text" className="validate no-margin" placeholder='€20' value={halfBoard} />
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
                        <input id='laundry' type="text" className="validate no-margin" placeholder='€20' value={laundry} />
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
                        <input id='cleaning' type="text" className="validate no-margin" placeholder='€20' value={cleaning} />
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
                        <input id='airport-pickup' type="text" className="validate no-margin" placeholder='€20' value={airportPickup} />
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
            <a id='pricing-save' className='btn btn-primary save-btn' onClick={this.handleClick}>Save</a>
          </div>
          <div className='col s3 right-align'>
            <a><i className="fa fa-chevron-right grey-text text-lighten-1 next-btn"></i></a>
          </div>
        </div>

      </div>


    );
  }
});
