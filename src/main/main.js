var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

// Tap events
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// Modal deps
var modal = require('react-modal');
var HowDoesItWork = require('./components/how-does-it-work.react');

// Render modal
ReactDOM.render(
  <HowDoesItWork />,
  document.getElementById('how-does-it-work')
);

// Dropdown script
if ($('dropdown-button').length) {
  $('.dropdown-button').click(function() {
      var $button, $menu;
      $button = $(this);
      $menu = $button.siblings(".dropdown-menu");
      $menu.toggleClass("show-menu");
      $menu.children("li").click(function() {
        $menu.removeClass("show-menu");
        $button.html($(this).html());
      });
  });
}
