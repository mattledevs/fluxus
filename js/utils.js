

/**
 * debouncing function from John Hann
 * http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
 */
debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced () {
      var obj = this, args = arguments;
      function delayed () {
          if (!execAsap)
              func.apply(obj, args);
          timeout = null;
      };

      if (timeout)
          clearTimeout(timeout);
      else if (execAsap)
          func.apply(obj, args);

      timeout = setTimeout(delayed, threshold || 100);
    };
};

window.log = function(){
  if( this.console ) {
    if ( arguments.length == 1 ) {
      console.log( arguments[0] );
    } else {
      console.log( Array.prototype.slice.call( arguments ) );
    }
  }
};


/**
 * Checks for iOS4 or less, which does not have position:fixed.
 */
window.iPadWithIOS4 = function () {

  if ( /(iPad)/i.test( navigator.userAgent ) ) {
    if(/OS [2-4]_\d(_\d)? like Mac OS X/i.test(navigator.userAgent)) {
        return true;
    } else if(/CPU like Mac OS X/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
  } else {
    return false;
  }

};


/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */

(function($) {

  var types = ['DOMMouseScroll', 'mousewheel'];

  if ($.event.fixHooks) {
      for ( var i=types.length; i; ) {
          $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
      }
  }

  $.event.special.mousewheel = {
      setup: function() {
          if ( this.addEventListener ) {
              for ( var i=types.length; i; ) {
                  this.addEventListener( types[--i], handler, false );
              }
          } else {
              this.onmousewheel = handler;
          }
      },

      teardown: function() {
          if ( this.removeEventListener ) {
              for ( var i=types.length; i; ) {
                  this.removeEventListener( types[--i], handler, false );
              }
          } else {
              this.onmousewheel = null;
          }
      }
  };

  $.fn.extend({
      mousewheel: function(fn) {
          return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
      },

      unmousewheel: function(fn) {
          return this.unbind("mousewheel", fn);
      }
  });


  function handler(event) {
      var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
      event = $.event.fix(orgEvent);
      event.type = "mousewheel";

      // Old school scrollwheel delta
      if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
      if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

      // New school multidimensional scroll (touchpads) deltas
      deltaY = delta;

      // Gecko
      if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
          deltaY = 0;
          deltaX = -1*delta;
      }

      // Webkit
      if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
      if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

      // Add event and delta to the front of the arguments
      args.unshift(event, delta, deltaX, deltaY);

      return ($.event.dispatch || $.event.handle).apply(this, args);
  }

})(jQuery);


/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 *
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function($) {
   $.fn.touchwipe = function(settings) {
     var config = {
        min_move_x: 20,
        min_move_y: 20,
      wipeLeft: function() { },
      wipeRight: function() { },
      wipeUp: function() { },
      wipeDown: function() { },
      preventDefaultEvents: true
   };

     if (settings) $.extend(config, settings);

     this.each(function() {
       var startX;
       var startY;
     var isMoving = false;

       function cancelTouch() {
         this.removeEventListener('touchmove', onTouchMove);
         startX = null;
         isMoving = false;
       }

       function onTouchMove(e) {
         if(config.preventDefaultEvents) {
           e.preventDefault();
         }
         if(isMoving) {
           var x = e.touches[0].pageX;
           var y = e.touches[0].pageY;
           var dx = startX - x;
           var dy = startY - y;
           if(Math.abs(dx) >= config.min_move_x) {
            cancelTouch();
            if(dx > 0) {
              config.wipeLeft();
            }
            else {
              config.wipeRight();
            }
           }
           else if(Math.abs(dy) >= config.min_move_y) {
              cancelTouch();
              if(dy > 0) {
                config.wipeDown();
              }
              else {
                config.wipeUp();
              }
             }
         }
       }

       function onTouchStart(e)
       {
         if (e.touches.length == 1) {
           startX = e.touches[0].pageX;
           startY = e.touches[0].pageY;
           isMoving = true;
           this.addEventListener('touchmove', onTouchMove, false);
         }
       }
       if ('ontouchstart' in document.documentElement) {
         this.addEventListener('touchstart', onTouchStart, false);
       }
     });

     return this;
   };

})( jQuery );


/**
 * Mousewheel plugin.
 */
(function( $, window, undefined ) {

  var types = ['DOMMouseScroll', 'mousewheel'];

  if ($.event.fixHooks) {
      for ( var i=types.length; i; ) {
          $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
      }
  }

  $.event.special.mousewheel = {
      setup: function() {
          if ( this.addEventListener ) {
              for ( var i=types.length; i; ) {
                  this.addEventListener( types[--i], handler, false );
              }
          } else {
              this.onmousewheel = handler;
          }
      },

      teardown: function() {
          if ( this.removeEventListener ) {
              for ( var i=types.length; i; ) {
                  this.removeEventListener( types[--i], handler, false );
              }
          } else {
              this.onmousewheel = null;
          }
      }
  };

  $.fn.extend({
      mousewheel: function(fn) {
          return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
      },

      unmousewheel: function(fn) {
          return this.unbind("mousewheel", fn);
      }
  });

  function handler(event) {
      var orgEvent = event || window.event,
          args = [].slice.call( arguments, 1 ),
          delta = 0,
          returnValue = true,
          deltaX = 0,
          deltaY = 0;
      event = $.event.fix(orgEvent);
      event.type = "mousewheel";

      // Old school scrollwheel delta
      if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
      if ( orgEvent.detail ) { delta = -orgEvent.detail/3; }

      // New school multidimensional scroll (touchpads) deltas
      deltaY = delta;

      // Gecko
      if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
          deltaY = 0;
          deltaX = -1*delta;
      }

      // Webkit
      if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
      if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

      // Add event and delta to the front of the arguments
      args.unshift(event, delta, deltaX, deltaY);

      return ($.event.dispatch || $.event.handle).apply(this, args);
  }

})( jQuery, window );


// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
  def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    //alert(jQuery.easing.default);
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
  },
  easeInQuad: function (x, t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInCubic: function (x, t, b, c, d) {
    return c*(t/=d)*t*t + b;
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },
  easeInQuart: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  easeInQuint: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t*t + b;
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  },
  easeInOutSine: function (x, t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },
  easeInExpo: function (x, t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
  },
  easeInElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
    return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
  }
});

/**
 * --------------------------------------------------------------------
 * Positions the element in the vertical middle using top-margin.
 * --------------------------------------------------------------------
 */
(function ( $, window, undefined ) {

  $.fn.verticalCenter = function( options ) {

    var $t = $( this );

    if ( $t.length > 1 ) {

      $t.each( function () {
        $( this ).verticalCenter( options );
      });

    } else {

      var defaults = {
        preloadSiblings: true
      }

      options = $.extend( {}, defaults, options );

      var $p = $t.parent();
      var height = $t.outerHeight();
      var parentHeight = $p.height();

      if ( options.preloadSiblings ) {

        var $imageSiblings = $p.find( 'img' );

        if ( $imageSiblings.length && ( $t.data( 'child-images-loaded' ) == undefined ) ) {

          $t.data( 'child-images-loaded', true );

          $t.css( 'visibility', 'hidden' );


          $imageSiblings.each( function () {

            var img = new Image();

            $( img ).error( function () {

              $t.hide().css( 'visibility', 'visible' ).fadeIn();
              $t.verticalCenter();

            } ).load( function () {

              $t.hide().css( 'visibility', 'visible' ).fadeIn();
              $t.verticalCenter();

            } );

            img.src = $( this ).attr( 'src' );

          });

        }

      }

      if ( parentHeight <= height ) {
          return;
      }

      var top = Math.floor( (parentHeight - height) / 2 );

      var position = $t.css( 'position' );

      if ( ( position == 'absolute' ) || ( position == 'relative' ) ) {
        $t.css( 'top', top );
      } else {
        $t.css({
          top: top,
          position: 'relative'
        });
      }

    }

    return this;

  }

})( jQuery, window );


/**
 * --------------------------------------------------------------------
 * Returns highest DOM element in the jQuery array.
 * --------------------------------------------------------------------
 */
(function ( $, window, undefined ) {

  $.fn.highestElement = function() {

    var $t = $( this );
    var elementHeight = 0;
    var elementIndex = false;

    $t.each( function ( index ) {
      if ( $(this).outerHeight() > elementHeight ) {
        elementHeight = $(this).outerHeight();
        elementIndex = index;
      }
    });

    if ( elementIndex !== false ) {

      return $t.eq( elementIndex );

    }

    return jQuery('');

  }

})( jQuery, window );



/**
 * --------------------------------------------------------------------
 * addTempCss() jQuery plugin.
 *
 * Sets a temporary CSS memorizing the old one
 * (probably set by a stylesheet), so that it can be restored later.
 * --------------------------------------------------------------------
 */
( function ( $, window, undefined ) {

  $.fn.addTempCss = function( cssProp, cssValue ) {

    if ( this.data( 'temp-css-' + cssProp ) == undefined ) {
      this.data( 'temp-css-' + cssProp, this.css( cssProp ) );
    }

    return this.css( cssProp, cssValue );

  }

  $.fn.removeTempCss = function( cssProp ) {

    var originalValue = this.data( 'temp-css-' + cssProp );

    if ( originalValue && ( originalValue != undefined ) ) {
      this.removeData( 'temp-css-' + cssProp );
      this.css( cssProp, originalValue );
    }

    return this;

  }

}( jQuery, window ));



/**
 * --------------------------------------------------------------------
 * Keyboard arrows & mousewheel navigation.
 * --------------------------------------------------------------------
 */
( function ( $, window, undefined ) {

  Navigation = function ( options ) {

    this.options = $.extend( {}, Navigation.settings, options );
    this.$items = [];

  }

  Navigation.settings = {

    /**
     * Returns an X-axis point which should be considered as align position.
     */
    getAlignX: function () {
      return Math.round( $( window ).width() / 2 );
    },

    onKeyboardNext: null,
    onKeyboardPrevious: null,
    onItemNext: null,
    onItemPrevious: null

  }

  Navigation.prototype = {

    setItems: function ( $items ) {

      this.$items = $items;
      if ( ( $items.length > 1 ) && ( this.options.onSetItems != undefined ) ) {
        this.options.onSetItems.call( this );
      }

      if ( this.$items && ( this.$items.length > 1 ) ) {
        this.enableMousewheel();
        this.enableKeyboard();
      }

    },

    getActiveItem: function () {

      if ( this.$items.length == 0 ) {
        return false;
      }

      var $activeItem = false;

      var centralPoint = $(window).scrollLeft() + this.options.getAlignX();

      var distances = [];

      /**
       * Go though all the items and find which one is located on the center.
       */
      for ( var i = 0; i < this.$items.length; i++ ) {

          var $t = this.$items.eq( i );
          var itemLeftSide  = parseInt( $t.offset().left );
          var itemRightSide = parseInt( itemLeftSide + $t.width() );

          if ( (itemLeftSide <= centralPoint) && (itemRightSide > centralPoint) ) {
              $activeItem = $t;
              break;
          }

          if ( Math.abs(itemLeftSide - centralPoint) > Math.abs(itemRightSide - centralPoint) ) {
              distances.push( Math.abs(itemRightSide - centralPoint ) );
          } else {
              distances.push( Math.abs(itemLeftSide - centralPoint ) );
          }

      }

      if ( ! $activeItem ) {

        var $firstItem = this.$items.eq( 0 );
        if ( $firstItem.offset().left > centralPoint ) {
            $activeItem = $firstItem;
        }

      }

      if ( ! $activeItem ) {
        /**
         * No item is exactly at central point, let's find the one that is the closest.
         */
        var min = distances[0];
        var minIndex = 0;

        for (var i = 0; i < distances.length; i++) {
          if ( min > distances[i] ) {
            min = distances[i];
            minIndex = i;
          }
        }

        $activeItem = this.$items.eq( minIndex );

      }


      /**
       * Special Case: If we are at the very end of the HTML document
       * return the one that is just left from the central point.
       */
      if ( $(window).scrollLeft() + $(window).width() == $(document).width() ) {

        for ( var i = this.$items.length - 1; i != 0; i-- ) {

          $activeItem = this.$items.eq( i );
          var itemLeftSide  = parseInt( $activeItem.offset().left );

          if ( itemLeftSide < centralPoint ) {
            if ( i != this.$items.length - 1 ) {
              $activeItem = this.$items.eq( i + 1 );
            }
            break;
          }

        }

      }

      return $activeItem;
    },

    getNextItem: function () {

      var activeItemIndex = this.$items.index( this.getActiveItem() );
      return this.$items.eq( activeItemIndex + 1 );

    },

    getPreviousItem: function () {

      var activeItemIndex = this.$items.index( this.getActiveItem() );
      if ( 0 == activeItemIndex ) {
          return false;
      }
      return this.$items.eq( activeItemIndex - 1 );

    },

    nextItem: function () {

      if ( this.$items.length == 0 ) {
        return false;
      }

      this.scrollToItem( this.getNextItem() );

      if ( typeof this.options.onItemNext == 'function' ) {
        this.options.onItemNext.apply( this );
      }

    },

    previousItem: function () {

      if ( this.$items.length == 0 ) {
        return false;
      }

      this.scrollToItem( this.getPreviousItem() );

      if ( typeof this.options.onItemPrevious == 'function' ) {
        this.options.onItemPrevious.apply( this );
      }

    },

    enableMousewheel: function() {

      var self = this;

      $(window).bind('mousewheel.fluxus', debounce(function (e, delta, deltaX, deltaY) {
        if ( deltaX == 0 ) {
          var $newActiveItem = deltaY < 0 ? self.getNextItem() : self.getPreviousItem();
          self.scrollToItem($newActiveItem);
        }
      }));

    },

    scrollToItem: function ( $item ) {

      if ( $item && $item.length ) {
          $('html,body').not(':animated').animate({
              scrollLeft: $item.offset().left - this.options.getAlignX()
            }, 300);
      }

    },

    enableKeyboard: function () {
      var self = this;

      $( window ).bind( 'keydown.navigation.fluxus', function ( e ) {

          if ( self.$items.length == 0 ) {
            return true;
          }

          // on right arrow click
          if ( e.which == 39 ) {

            if ( typeof self.options.onKeyboardNext == 'function' ) {
              if ( self.options.onKeyboardNext.apply( self, e ) ) {
                self.nextItem();
              }
            } else {
              self.nextItem();
            }

            return false;
          }

          // on left arrow click
          if ( e.which == 37 ) {

            if ( typeof self.options.onKeyboardPrevious == 'function' ) {
              if ( self.options.onKeyboardPrevious.apply( self, e ) ) {
                self.previousItem();
              }
            } else {
              self.previousItem();
            }

            return false;

          }

      });

    },

    disableKeyboard: function () {
      $( window ).unbind( 'keydown.navigation.fluxus' );
    }

  }


})( jQuery, window );


(function ( $, window, undefined ) {

  $.Appreciate = function( options, element, callback ) {

    this.$element     = $( element );
    this.callback     = callback;

    this.options      = $.extend( {}, $.Appreciate.settings, options );

    this.ajaxurl      = this.$element.data( 'ajaxurl' );
    this.id           = this.$element.data( 'id' );
    this.title_after  = this.$element.data( 'title-after' );

    this._init();

  };

  $.Appreciate.settings = {

    template: '<span class="icon"></span><b class="numbers">{count}</b>'

  }

  $.Appreciate.prototype = {

    _init: function () {

      var self = this;

      this.count = this.$element.data( 'count' );
      if ( !this.count ) {
        this.count = 0;
      }

      if ( this.$element.is( '.has-appreciated' ) ) {
        this.$element.find( '.appreciate-title' ).html( this.title_after );
      }

      this.$template = this.options.template.replace( '{count}', this.count );
      this.$template = $( this.$template );

      this.$element.append(
          this.$template
        );

      this.$element.click( function () {

        var $t = $( this );
        if ( $t.is( '.has-appreciated' ) ) {
          return false;
        }

        self.count++;

        self.$element.find( '.numbers' ).html( self.count );
        self.$element.find( '.appreciate-title' ).html( this.title_after );

        if ( self.ajaxurl != undefined ) {

          $.post( self.ajaxurl, {
            action: 'appreciate',
            post_id: self.id
          });

        }

        $t.addClass( 'has-appreciated' );

        return false;

      });

    }

  }

  $.fn.appreciate = function( options, callback ) {

   this.data( 'apprecaite', new $.Appreciate( options, this, callback ) );
   return this;

  }

})( jQuery, window );


(function ( $, window, undefined ) {

  MobileNav = function( $items, options ) {

    this.options = $.extend( MobileNav.settings, options );
    this.$items  = $items;

    this._create();

  }

  MobileNav.settings = {
    openButtonTitle: 'Menu',
    minWindowWidth: 480
  }

  MobileNav.prototype = {

    _create: function () {

      var self = this;

      /**
       * Create mobile menu DOM element.
       */
      var menuTemplate = '' +
        '<div id="mobilenav" class="closed">' +
          '<a href="#" class="btn-open">' + this.options.openButtonTitle + '</a>' +
          '<nav></nav>' +
        '</div>';

      var $menu = $( menuTemplate );
      var $nav  = $menu.find('nav');

      this.$items.each(function () {
        var level = 1;
        var $t = $(this);
        if ( $t.data('level') != undefined ) {
          level = $t.data('level');
        }

        var $a = $('<a />').attr({
                    href: $t.attr('href')
                  }).html($t.html());

        $a.addClass('level-' + level);

        if ( self.options.active.get(0) == $t.get(0) ) {
          $a.addClass('active');
        }

        $nav.append( $a );
      });

      $( 'body' ).append( $menu );
      this.$menu = $menu;

      $menu.css({
        left: $menu.outerWidth() * -1
      })

      /**
       * Open / Close button functionality.
       */
      $menu.find( '.btn-open' ).click( function () {
        if ( $menu.is( '.closed' ) ) {
          self.open();
        } else {
          self.close();
        }
        return false;
      });

    },


    open: function () {

      var windowHeight = $(window).height();
      var docHeight    = $(document).height();

      this.$menu.removeClass('closed').addClass('opened');

      this.$menu.css({
        height: windowHeight > docHeight ? windowHeight : docHeight
      }).animate({
        left: 0
      }, 300);

    },


    close: function () {

      this.$menu.removeClass('opened').addClass('closed');
      this.$menu.animate({
        left: this.$menu.outerWidth() * -1
      }, 300);

    }


  }

})( jQuery, window );

