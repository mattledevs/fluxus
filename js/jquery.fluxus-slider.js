/**
 * --------------------------------------------------------------------
 * Fluxus Full Page Slider jQuery plugin.
 * --------------------------------------------------------------------
 */
( function ( window, $, undefined ) {

  $.FluxusSlider = function ( options, element, callback ) {

    this.$element       = $( element );
    this.$slides        = this.$element.find( '.slide' );
    this.slideCount     = this.$slides.length;
    this.slidesLoaded   = 0;
    this.options        = $.extend( {}, $.FluxusSlider.settings, options );
    this.isActivating   = false;

    if ( 0 != this.$slides.length ) {
        this.$slides.data( 'loaded', false );
        this._init();
    }

  };

  $.FluxusSlider.settings = {
    onNextSlide: undefined,
    onPreviousSlide: undefined
  }

  $.FluxusSlider.prototype = {

    _init: function () {

        var self = this,
            $firstSlide = this.$slides.first();

        /**
         * Setup infoboxes.
         */
        this.$element.find( '.info' ).each( function () {
            var $infobox = $( this ),
                t = 0;

            $( window ).on( 'resize.infobox.fluxus', function () {
                clearTimeout( t );
                t = setTimeout( function () {
                    self.setInfoboxPosition.call( self, $infobox );
                }, 100 );
            });
            self.setInfoboxPosition( $infobox );
        });

        /**
         * Load first image.
         */
        this.load( $firstSlide, function () {

            /**
             * Setup navigation items.
             */
            if ( this.slideCount > 1 ) {

                /**
                 * Navigation arrows.
                 */
                $( '.slider-arrow-left,.slider-arrow-right' ).show().click( function () {

                    if ( $( this ).is( '.slider-arrow-right' ) ) {
                        self.next();
                    } else {
                        self.previous();
                    }

                    return false;

                });

                this.enableNavigationGestures();

                /**
                 * Navigation bullets.
                 */
                var $nav = $( '<nav class="slider-navigation" >');

                this.$slides.each( function () {
                    var $link = $( '<li><a href="#"></a></li>' );
                    var title = $( this ).find( '.slide-title' ).html();

                    if ( ( title != undefined ) && title ) {
                        $link.find( 'a' ).append( $( '<span />').html( title ) );
                    }
                    $nav.append( $link );
                })

                $nav.hide().appendTo( this.$element )
                    .find( 'a' ).click( function () {

                        var $t = $(this);
                        if ( $t.is( '.active' ) ) {
                            return false;
                        }

                        $nav.find( '.active' ).removeClass( 'active' );
                        $t.addClass( 'active' );

                        var index = $t.parent().prevAll().length;
                        self.activate( self.$slides.eq( index ) );
                        return false;

                    }).first().addClass( 'active' );

                this.$nav = $nav;

                this.$nav.show();

            } else {

                this.$nav = $( '<div />' ); // foo object.

            }

            /**
             * Show first slide.
             */
            var $active = $firstSlide.addClass( 'active' );

            this.$slides.css( 'opacity', 1 );

            $active.css( 'visibility', 'visible' ).transition({
                opacity: 1
            }, 1500 );

            this.loadAll();

            /**
             * Bind keyboard events.
             */
            $( window ).on( 'keydown.slider.fluxus', function ( e ) {

                if ( self.slideCount < 2 ) {
                    return true;
                }

                // right arrow down
                if ( e.which == 39 ) {
                    self.next();
                    return false;
                }

                // left arrow down
                if ( e.which == 37 ) {
                    self.previous();
                    return false;
                }

            });

        });

    },

    _isCallable: function ( variable ) {

        return variable && ( typeof variable === 'function' );

    },

    _getSelectedText: function () {

        var t = '';
        if ( window.getSelection && this._isCallable( window.getSelection ) ) {
            t = window.getSelection();
        } else if ( document.getSelection && this._isCallable( document.getSelection ) ) {
            t = document.getSelection();
        }else if ( document.selection ){
            t = document.selection.createRange().text;
        }
        return t;

    },

    enableNavigationGestures: function () {

        var isDragging = false;
        var downPosition = false;
        var self = this;

        this.$slides.on( 'mousedown.slider.fluxus', function ( e ) {

            downPosition = e.screenX;

            $( window ).on( 'mousemove.slider.fluxus', function () {

                isDragging = true;
                $( window ).off( 'mousemove.slider.fluxus' );

            } );

        } ).on( 'mouseup', function ( e ) {

            var wasDragging = isDragging;
            isDragging = false;

            $( window ).off( 'mousemove.slider.fluxus' );

            if ( wasDragging ) {

                var selectedText = self._getSelectedText();

                if ( new String( selectedText ).length == 0 ) {

                    var delta = downPosition - e.screenX;

                    if ( Math.abs( delta ) > 150 ) {

                        if ( delta > 0 ) {
                            self.next();
                        } else {
                            self.previous();
                        }

                    }

                }

            }

        } );

        // Requires a touchwipe jQuery plugin
        if ( typeof $.fn.touchwipe != 'function' ) {
            return;
        }

        this.$element.touchwipe( {
            wipeLeft: function() {
                self.next( 300 );
            },
            wipeRight: function() {
                self.previous( 300 );
            },
            min_move_x: 20,
            min_move_y: 20,
            preventDefaultEvents: true
        });

    },

    setInfoboxPosition: function ( $infobox ) {

        var width       = this.$element.width();
        var height      = this.$element.height();
        var infoHeight  = $infobox.outerHeight();
        var infoWidth   = $infobox.outerWidth();

        if ( $infobox.data( 'position' ) == 'custom' ) {

           if ( width > 480 ) {

                var top = $infobox.data( 'top' );
                var left = $infobox.data( 'left' );

                // Prevents infobox going out of bounds.
                if ( /%$/.test( top ) && /%$/.test( left ) ) {

                    var topPx = Math.round( parseInt(top) * height / 100 );
                    var leftPx = Math.round( parseInt(left) * width / 100 );

                    if ( leftPx + infoWidth > width ) {
                        left = width - infoWidth;
                    }

                    if ( topPx + infoHeight > height ) {
                        top = height - infoHeight;
                        top = top < 0 ? 0 : top;
                    }

                }

                $infobox.css({
                    top: top,
                    left: left
                });


            } else {

                $infobox.css({
                    top: Math.round( ( height - infoHeight ) / 2 ),
                    left: Math.round( ( width - infoWidth ) / 2 )
                });

            }

        } else {

            var top = Math.round( ( height - infoHeight ) / 2 );
            var left = Math.round( ( width - infoWidth ) / 2 );

            $infobox.css({
                top: top,
                left: left
            });

        }

    },

    activate: function ( $slide, direction, transitionSpeed ) {

        if ( this.isActivating || $slide.is( '.active' ) ) {
            return false;
        }

        this.isActivating = true;

        var self = this;
        var $active = this.$slides.filter( '.active' )
        var index = this.$slides.index( $slide );
        var activeIndex = this.$slides.index( $active );
        var $infoboxParts = $slide.find( '.animate-1, .animate-2' ).css( 'opacity', 0 );

        /**
         * Set CSS .active classes
         */
        $active.removeClass( 'active' );
        $slide.addClass( 'active' );

        this.$nav.find( '.active' ).removeClass( 'active' );
        this.$nav.find( 'a:eq(' + index + ')' ).addClass( 'active' );

        // Set the z-index so that new slide is under the old one.
        $active.css( 'z-index', 50 );
        $slide.css({
                zIndex: 30,
                visibility: 'visible',  // make it visible
                x: 0                    // bring it back to original offset
            });

        if ( direction == undefined ) {
            direction = activeIndex > index ? 1 : -1;
        }

        var speed = transitionSpeed == undefined ? 1000 : transitionSpeed;

        $active.transition({
            x: $( window ).width() * direction
        }, speed, 'ease-in', function () {

            $active.css( 'visibility', 'hidden' );

            self.isActivating = false;

            $infoboxParts.eq( 0 ).css({
                x: -100
            }).delay( 200 ).transition({
                x: 0,
                opacity: 1
            }, 500 );

            $infoboxParts.eq( 1 ).css({
                x: 100
            }).delay( 500 ).transition({
                x: 0,
                opacity: 1
            }, 500 );

        });

    },

    next: function ( transitionSpeed ) {

        var index = this.$slides.filter( '.active' ).prevAll().length;
        index = this.slideCount - 1 == index ? 0 : index + 1;
        this.activate( this.$slides.eq( index ), -1, transitionSpeed );

        if ( this.options.onNextSlide != undefined ) {
            this.options.onNextSlide.call( this );
        }

    },

    previous: function ( transitionSpeed ) {

        var index = this.$slides.filter( '.active' ).prevAll().length;
        index = 0 == index ? this.slideCount - 1 : index - 1;
        this.activate( this.$slides.eq( index ), 1, transitionSpeed );

        if ( this.options.onPreviousSlide != undefined ) {
            this.options.onPreviousSlide.call( this );
        }

    },

    load: function ( $slideToLoad, onFinish ) {

        if ( true === $slideToLoad.data( 'loaded' ) ) {
            onFinish.call( this );
            return;
        }

        var self = this;
        var img  = new Image();

        $( img ).on( 'load error', function () {

            $slideToLoad.data( 'loaded', true )
                        .css( 'background-image', 'url(' + img.src + ')' );

            self.slidesLoaded++;
            onFinish.call( self );

        });

        img.src = $slideToLoad.data( 'image' );

    },

    loadAll: function ( callback ) {

        var self = this;

        this.slidesLoaded = 0;

        this.$slides.each( function () {

            var $t = $( this );
            if ( false === $t.data( 'loaded' ) ) {

                self.load( $t, function () {
                    self.slidesLoaded++;

                    if ( ( self.slidesLoaded == self.slideCount ) && ( typeof callback == 'function' ) ) {
                        callback.call( self );
                    }
                } );

            } else {

                self.slidesLoaded++;

                if ( ( self.slidesLoaded == self.slideCount ) && ( typeof callback == 'function' ) ) {
                    callback.call( self );
                }

            }

        });

    }

  }

  $.fn.fluxusSlider = function ( options, callback ) {

    this.data( 'slider', new $.FluxusSlider( options, this, callback ) );
    return this;

  }

}( window, jQuery ));

