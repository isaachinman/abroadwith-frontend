var React = require('react');
var ReactDOM = require('react-dom');
var RoomPriceModule = require('./room-price-module.react');
var i18n = require('../../global/components/i18n');

i18n.loadNamespaces(['manage_home','homes']);

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
        var price = parseInt(($(this).find('.room-price').val()).match(/\d+/)[0]);
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
      newPricingObj.discounts = [];
      newPricingObj.extras = [];

      newPricingObj.currency = $('select#currency').val();

      function createPricingObject(category, item) {
        newPricingObj[category][item] = [];
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

        this.props.updateHome();

        Materialize.toast(i18n.t('manage_home:pricing_updated_toast'), 4000);

      }
    }
  },
  componentDidMount: function() {
    if ($('li#no-rooms-pricing').length) {
      $('li#no-rooms-pricing').click(function() {
        $('ul.tabs').tabs('select_tab', 'rooms');
      })
    }

    $('#save-pricing').click(this.savePricing);
  },
  componentDidUpdate: function() {

    // Set price vars
    if (this.props.pricing && this.props.pricing.currency) {
      $('select#currency').val(this.props.pricing.currency);
      this.props.pricing.discounts.oneMonthDiscount ? $('input#one-month-discount').val(this.props.pricing.discounts.oneMonthDiscount.amount + '%') : null;
      this.props.pricing.discounts.threeMonthDiscount ? $('input#three-month-discount').val(this.props.pricing.discounts.threeMonthDiscount.amount + '%') : null;
      this.props.pricing.discounts.sixMonthDiscount ? $('input#six-month-discount').val(this.props.pricing.discounts.sixMonthDiscount.amount + '%') : null;
      this.props.pricing.extras.EXTRA_GUEST ? $('input#extra-guest').val(this.props.pricing.extras.EXTRA_GUEST.cost) : null;
      this.props.pricing.extras.FULL_BOARD ? $('input#full-board').val(this.props.pricing.extras.FULL_BOARD.cost) : null;
      this.props.pricing.extras.HALF_BOARD ? $('input#full-board').val(this.props.pricing.extras.HALF_BOARD.cost) : null;
      this.props.pricing.extras.LAUNDRY ? $('input#laundry').val(this.props.pricing.extras.LAUNDRY.cost) : null;
      this.props.pricing.extras.CLEANING ? $('input#cleaning').val(this.props.pricing.extras.CLEANING.cost) : null;
      this.props.pricing.extras.AIRPORT_PICKUP ? $('input#airport-pickup').val(this.props.pricing.extras.AIRPORT_PICKUP.cost) : null;
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

    }

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
