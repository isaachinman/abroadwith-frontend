var React = require('react');
var ReactDOM = require('react-dom');
var RoomPriceModule = require('./room-price-module.react');

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

    // Create new pricing object
    if (this.props.pricing) {

      var newPricingObj = {};
      newPricingObj.discounts = {};
      newPricingObj.extras = {};

      function createPricingObject(category, item) {
        newPricingObj[category][item] = {};
        newPricingObj[category][item].name = item;
        newPricingObj[category][item].amount = $('input#'+item).val();
      }

      createPricingObject('discounts', 'oneMonthDiscount');
      createPricingObject('discounts', 'threeMonthDiscount');
      createPricingObject('discounts', 'sixMonthDiscount');
      createPricingObject('extras', 'EXTRA_GUEST');
      createPricingObject('extras', 'FULL_BOARD');
      createPricingObject('extras', 'HALF_BOARD');
      createPricingObject('extras', 'LAUNDRY');
      createPricingObject('extras', 'CLEANING');
      createPricingObject('extras', 'AIRPORT_PICKUP');

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
