var React = require('react');
var ReactDOM = require('react-dom');
var RoomPriceModule = require('./room-price-module.react');
var i18n = require('../../global/util/i18n');

var toast = require('toast');

var currencies = require('currencies');

module.exports = React.createClass({
  savePricing: function() {

    var newHomeObj = this.props.props;

    // If user has rooms
    if (this.props.props.rooms.length > 0) {

      // Create new rooms object
      newRoomObj = this.props.props.rooms;

      function changePrice( id, price ) {
         for (var i in newRoomObj) {
           if (newRoomObj[i].id == id) {
              newRoomObj[i].price = parseInt(price);
              break;
           }
         }
      }

      $('li.room').each(function() {
        var id = $(this).attr('data-id');
        console.log($(this).find('.room-price').val());
        var price = $(this).find('.room-price').val() !== '' ? parseInt(($(this).find('.room-price').val()).match(/\d+/)[0]) : null;
        changePrice(id, price);
      })

      // Modify home object, using new rooms object
      newHomeObj.rooms = newRoomObj;

    }

    // Create new pricing object
    if (this.props.props.pricing) {

      var newPricingObj = {};
      newPricingObj.discounts = [];
      newPricingObj.extras = [];

      newPricingObj.currency = $('select#currency').val();

      function createDiscountObject(category, item) {
        if ($('input#'+item).val() !== '') {
          var newPriceObj = {
            "name": item,
            "amount": parseInt($('input#'+item).val())
          }
          newPricingObj[category].push(newPriceObj);
        }
      }

      function createServiceObject(category, item) {
        if ($('input#'+item).val() !== '') {
          var newPriceObj = {
            "service": item,
            "cost": parseInt(Number(($('input#'+item).val().replace(/[^0-9\.]+/g,""))))
          }
          newPricingObj[category].push(newPriceObj);
        }
      }

      createDiscountObject('discounts', 'oneMonthDiscount');
      createDiscountObject('discounts', 'threeMonthDiscount');
      createDiscountObject('discounts', 'sixMonthDiscount');
      createServiceObject('extras', 'EXTRA_GUEST');
      createServiceObject('extras', 'FULL_BOARD');
      createServiceObject('extras', 'HALF_BOARD');
      createServiceObject('extras', 'LAUNDRY');
      createServiceObject('extras', 'CLEANING');
      createServiceObject('extras', 'AIRPORT_PICKUP');

      // Set new tandem discounts
      if ($('#tandem-discount').val() !== '' && $('#tandem-discount').val() !== 'undefined' && $('#tandem-discount').val() !== null && newHomeObj.immersions.tandem !== null && newHomeObj.immersions.tandem.languagesInterested !== null && newHomeObj.immersions.tandem.languagesInterested.length > 0) {
        var newTandemDiscount = parseInt($('#tandem-discount').val());
        for (var i=0; i<newHomeObj.immersions.tandem.languagesInterested.length; i++) {
          newHomeObj.immersions.tandem.languagesInterested[i].discount = newTandemDiscount;
        }
      }

      // Modify home object, using new pricing object
      newHomeObj.pricing = newPricingObj;

      this.props.updateHome(newHomeObj, function() {
        toast('Pricing updated');
      });


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
    if (this.props.props.pricing && this.props.props.pricing.currency) {

      $('select#currency').val(this.props.props.pricing.currency);

      for (var i=0; i<this.props.props.pricing.discounts.length; i++) {
        $('#'+this.props.props.pricing.discounts[i].name).val(this.props.props.pricing.discounts[i].amount + '%')
      }

      for (var i=0; i<this.props.props.pricing.extras.length; i++) {
        console.log(this.props.props.pricing.extras[i].service)
        $('#'+this.props.props.pricing.extras[i].service).val(currencies[this.props.props.pricing.currency]+ this.props.props.pricing.extras[i].cost);
      }

    }

    if (this.props.props.immersions) {
      if (this.props.props.immersions.tandem === null) {
        $('.tandem-discount-field').hide();
      } else  {
        $('.tandem-discount-field').show();
      }
    }

    // Create room modules if rooms exist
    var rooms = [];
    if (this.props.props.rooms.length > 0 && this.props.props.pricing) {

      var currency = this.props.props.pricing.currency;

      var rooms = (this.props.props.rooms).sort(function(a,b){return -(a.id-b.id)});

      console.log(rooms)

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

    $('.tooltipped').tooltip();

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
