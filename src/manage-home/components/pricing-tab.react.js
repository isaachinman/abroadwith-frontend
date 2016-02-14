var React = require('react');
var ReactDOM = require('react-dom');
var RoomPriceModule = require('./room-price-module.react')
var TandemDiscountModule = require('./tandem-discount-module.react')

module.exports = React.createClass({
  savePricing: function() {

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
        var discount = $('#tandem-discount').val();
        changeDiscount(lang, discount);

      })

      // Modify home object, using new rooms object
      if (typeof homeObj !== 'undefined') {
        homeObj.immersions.tandem.languagesInterested = newTandemObj;
      }

    }

    // Create new pricing object
    if (this.props.pricing) {

      var newPricingObj = {};
      newPricingObj.discounts = {};
      newPricingObj.extras = {};

      newPricingObj.currency = $('select#currency').val();
      newPricingObj.discounts.oneMonthDiscount = {};
      newPricingObj.discounts.oneMonthDiscount.name = "oneMonthDiscount";
      newPricingObj.discounts.oneMonthDiscount.amount = $('input#one-month-discount').val();
      newPricingObj.discounts.threeMonthDiscount = {};
      newPricingObj.discounts.threeMonthDiscount.name = "threeMonthDiscount";
      newPricingObj.discounts.threeMonthDiscount.amount = $('input#three-month-discount').val();
      newPricingObj.discounts.sixMonthDiscount = {};
      newPricingObj.discounts.sixMonthDiscount.name = "sixMonthDiscount";
      newPricingObj.discounts.sixMonthDiscount.amount = $('input#six-month-discount').val();
      newPricingObj.extras.EXTRA_GUEST = {};
      newPricingObj.extras.EXTRA_GUEST.service = "EXTRA_GUEST";
      newPricingObj.extras.EXTRA_GUEST.cost = $('input#extra-guest').val();
      newPricingObj.extras.FULL_BOARD = {};
      newPricingObj.extras.FULL_BOARD.service = "FULL_BOARD";
      newPricingObj.extras.FULL_BOARD.cost = $('input#full-board').val();
      newPricingObj.extras.HALF_BOARD = {};
      newPricingObj.extras.HALF_BOARD.service = "HALF_BOARD";
      newPricingObj.extras.HALF_BOARD.cost = $('input#half-board').val();
      newPricingObj.extras.LAUNDRY = {};
      newPricingObj.extras.LAUNDRY.service = "LAUNDRY";
      newPricingObj.extras.LAUNDRY.cost = $('input#laundry').val();
      newPricingObj.extras.CLEANING = {};
      newPricingObj.extras.CLEANING.service = "CLEANING";
      newPricingObj.extras.CLEANING.cost = $('input#cleaning').val();
      newPricingObj.extras.AIRPORT_PICKUP = {};
      newPricingObj.extras.AIRPORT_PICKUP.service = "AIRPORT_PICKUP";
      newPricingObj.extras.AIRPORT_PICKUP.cost = $('input#airport-pickup').val();

      // Modify home object, using new pricing object
      if (typeof homeObj !== 'undefined') {
        console.log(newPricingObj)
        homeObj.pricing = newPricingObj;

        // POST new home object
        Materialize.toast('Pricing updated', 4000);

      }

    }

  },
  componentDidUpdate: function() {

    // Set price vars
    if (this.props.pricing && this.props.pricing.currency) {
      $('select#currency').val(this.props.pricing.currency);
      $('input#one-month-discount').val(this.props.pricing.discounts.oneMonthDiscount.amount + '%');
      $('input#three-month-discount').val(this.props.pricing.discounts.threeMonthDiscount.amount + '%');
      $('input#six-month-discount').val(this.props.pricing.discounts.sixMonthDiscount.amount + '%');
      $('input#extra-guest').val(this.props.pricing.extras.EXTRA_GUEST.cost);
      $('input#full-board').val(this.props.pricing.extras.FULL_BOARD.cost);
      $('input#half-board').val(this.props.pricing.extras.HALF_BOARD.cost);
      $('input#laundry').val(this.props.pricing.extras.LAUNDRY.cost);
      $('input#cleaning').val(this.props.pricing.extras.CLEANING.cost);
      $('input#airport-pickup').val(this.props.pricing.extras.AIRPORT_PICKUP.cost);
    }

    // Create room modules if rooms exist
    var rooms = [];
    if (this.props.rooms && this.props.pricing) {

      var currency = this.props.pricing.currency;

      var rooms = this.props.rooms;

      var RoomsContainer = React.createClass({
        render: function() {
          var allRooms = []
          rooms.forEach(function(obj) {
            allRooms.push(
              <RoomPriceModule
                key={obj.id}
                id={obj.id}
                roomName={obj.name}
                bed={obj.bed}
                vacancies={obj.vacancies}
                img={obj.img}
                price={obj.price}
                currency={currency}
                />
            )
          })
          return (
            <div>{allRooms}</div>
          )
        }
      })

      ReactDOM.render(
        <RoomsContainer
        />, document.querySelector('#rooms-pricing')
      )

    } else {
      function goToRoomsTab() {
        $('ul.tabs').tabs('select_tab', 'rooms');
      }
      rooms = <li className="collection-item"><span className="title">You haven't created any rooms</span><br></br><a className='light' onClick={goToRoomsTab}>Go to the "Rooms" tab and make your first room</a></li>
    }

    $('#save-pricing').click(this.savePricing);

  },
  render: function() {

    return (

      <div></div>

    );
  }
});
