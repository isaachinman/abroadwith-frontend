$(function() {
  if ($('.button-group').length) {

    // If there is an active tab, show it
    if ($('.button-group li.active').length > 0) {
      $('#'+$('.button-group li.active:first-child').attr('data-target')).show();
    }

    // Click event, allow for slight dragging
    var coords = { startX: 0, endX: 0, startY: 0, endY: 0 };
    $('.button-group li')
      .mousedown(function(e) {
        coords.startX = coords.endX = e.pageX;
        coords.startY = coords.endY = e.pageY;
        $(window).mousemove(function(e) {
          coords.endX = e.pageX;
          coords.endY = e.pageY;
        });
      })
      .mouseup(function() {
        if (coords.startX - coords.endX  < 5 && coords.startX - coords.endX > - 5 && coords.startY - coords.endY < 5 && coords.startY - coords.endY > - 5) {
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
          if ($(this).attr('data-target')) {
            $('.tab').hide();
            $('#'+($(this).attr('data-target'))).show();
          }
        }
        $(window).unbind("mousemove");
      });


    // Drag stuff
    var _window = window;
    var _document = document;
    var mousemove = 'mousemove';
    var mouseup = 'mouseup';
    var mousedown = 'mousedown';
    var EventListener = 'EventListener';
    var addEventListener = 'add' + EventListener;
    var removeEventListener = 'remove' + EventListener;

    var dragged = [];
    var reset = function(i, el) {

      // cloning into array since HTMLCollection is updated dynamically
      dragged = [].slice.call(_document.getElementsByClassName('button-group'));
      for (i = 0; i < dragged.length;) {
        (function(el, lastClientX, lastClientY, pushed, scroller, cont) {
          (cont = el.container || el)[addEventListener](
            mousedown,
            cont.md = function(e) {
              if (!el.hasAttribute('nochilddrag') ||
                _document.elementFromPoint(
                  e.pageX, e.pageY
                ) == cont
              ) {
                pushed = 1;
                lastClientX = e.clientX;
                lastClientY = e.clientY;

                e.preventDefault();
              }
            }, 0
          );

          _window[addEventListener](
            mouseup, cont.mu = function(e) {
              pushed = 0;
            }, 0
          );

          _window[addEventListener](
            mousemove,
            cont.mm = function(e) {
              if (pushed) {
                (scroller = el.scroller || el).scrollLeft -=
                  (-lastClientX + (lastClientX = e.clientX));
                scroller.scrollTop -=
                  (-lastClientY + (lastClientY = e.clientY));
              }
            }, 0
          );
        })(dragged[i++]);
      }
    }

    reset();

  }
})
