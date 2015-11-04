
(function ( $, window, undefined ) {

    var namespace_index = 0;

    $.FluxusLightbox = function( $links, options ) {

        namespace_index++;

        var self = this;

        this.namespace = 'fluxus-lightbox-' + namespace_index;

        this.options = $.extend( {}, $.FluxusLightbox.settings, options );

        this.$images = $links.filter( 'a' );

        this.allImagesLoaded = false;

        if ( 0 == this.$images.length ) {
            return false;
        }

        this.$images.on( 'click.fluxus-lightbox', function () {

            var $imageLink = $( this );

            self.showImage.call( self, $imageLink, 0 );
            self.show.call( self, self.options.onShow );

            return false;

        });

        this.visible = false;

        this._init();

    }

    $.FluxusLightbox.settings = {
        close: 'Close',
        resize: '',
        previous: '',
        next: '',
        loading: 'Please wait...',
        error: 'Unable to load.',
        loadAll: true,
        mode: 'fit'     // fit or full
    }

    $.FluxusLightbox.prototype = {

        show: function ( callback ) {

            // Don't move a finger if it's already visible.
            if ( this.visible ) {
                return false;
            }

            var self = this;

            this.originalScrollPosition = {
                x: $( window ).scrollLeft(),
                y: $( window ).scrollTop()
            };

            $( 'html' ).addClass( 'fluxus-lightbox-visible' );

            /**
             * Animate background.
             */
            this.$lightbox.css({
                top: '-100%',
                display: 'block'
            }).animate({
                top: 0
            }, 500, function () {

                if ( callback != undefined ) {
                    callback.call( self );
                }

            });

            this.visible = true;

            // bind events
            $( window ).on( 'keydown.fluxus-lightbox', function ( e ) {

                if ( e.which == 39 ) {
                    self.next.call( self );
                    return false;
                }

                if ( e.which == 37 ) {
                    self.previous.call( self );
                    return false;
                }

                if ( e.which == 27 ) {
                    self.hide.call( self );
                    return false;
                }

            });

            var resizeDebounce = 0;

            // Requires a touchwipe jQuery plugin
            if ( typeof $.fn.touchwipe == 'function' ) {
                var self = this;

                this.$lightbox.touchwipe( {
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
            }

        },


        hide: function () {

            if ( ! this.visible ) {
                return false;
            }



            this.$lightbox.fadeOut( 500, this.options.onHide );

            $( 'html' ).removeClass( 'fluxus-lightbox-visible' );

            $( window ).off( 'keydown.fluxus-lightbox' )
                       .off( 'resize.fluxus-lightbox' );

            window.scrollTo( this.originalScrollPosition.x, this.originalScrollPosition.y );

            this.visible = false;

        },


        showImage: function ( $imageLink, fadeInTime ) {

            var self = this;
            var img = new Image();
            var $newImage = $( '<img />' );
            var resizeDebounce = 0;

            var $oldImg = this.$contents.find( 'img' );

            // if this is the same image
            if ( $oldImg.length && ( $oldImg.attr( 'src' ) == $imageLink.attr( 'href' ) ) ) {
                return false;
            }

            if ( $imageLink.data( 'loaded' ) != true ) {
                this.$contents.html( '<b class="loading-image">%loading<b>'.replace( '%loading', this.options.loading ) );
            }

            $( img ).error( function ( e ) {

                self.$contents.html( '<b class="error-image">%error</b>'.replace( '%error', self.options.error ) );

            } ).load( function () {

                $imageLink.data( 'loaded', true );

                $newImage.attr( 'src', img.src )
                         .hide();

                self.resizeImage( $newImage );

                $( window ).off( 'resize.fluxus-lightbox' )
                           .on( 'resize.fluxus-lightbox', function () {

                                clearTimeout( resizeDebounce );
                                resizeDebounce = setTimeout( function () {
                                    self.resizeImage( $newImage );
                                }, 100 );

                            });

                self.$contents.html( $newImage );

                if ( fadeInTime != 0 ) {
                    fadeInTime = fadeInTime != undefined ? fadeInTime : 400;
                    $newImage.fadeIn( fadeInTime );
                } else {
                    $newImage.show();
                }

                if ( self.options.loadAll && ( self.allImagesLoaded == false ) ) {

                    self.allImagesLoaded = true;

                    self.$images.each( function () {

                        if ( $( this ).data( 'loaded' ) != true ) {

                            var img = new Image();
                            img.src = $( this ).data( 'loaded', true ).attr( 'href' );

                        }

                    });

                }

            } );

            this.$images.removeClass( 'lightbox-active' );
            $imageLink.addClass( 'lightbox-active' );

            img.src = $imageLink.attr( 'href' );

        },


        next: function () {

            var $active = this.$images.filter( '.lightbox-active' );
            var activeIndex = this.$images.index( $active );
            var count = this.$images.length;
            var newIndex = 0;

            if ( activeIndex != -1 ) {
                if ( activeIndex + 1 != count ) {
                    newIndex = activeIndex + 1;
                }
            }

            this.showImage( this.$images.eq( newIndex ) );

        },


        previous: function () {

            var $active = this.$images.filter( '.lightbox-active' );
            var activeIndex = this.$images.index( $active );
            var count = this.$images.length;
            var newIndex = count - 1;

            if ( activeIndex != -1 ) {
                if ( activeIndex != 0 ) {
                    newIndex = activeIndex - 1;
                }
            }

            this.showImage( this.$images.eq( newIndex ) );

        },


        /**
         * Initialize Lightbox.
         */
        _init: function () {

            var self = this;

            var template = '' +
                '<div class="fluxus-lightbox ' + this.namespace + '">' +
                    '<div class="lightbox-content">' +
                    '</div>' +
                    '<span class="lightbox-close icon-cancel">%close</span>' +
                    '<span class="lightbox-resize icon-resize-small">%resize</span>' +
                    '<span class="lightbox-prev icon-left-open-big">%previous</span>' +
                    '<span class="lightbox-next icon-right-open-big">%next</span>' +
                '</div>';

            template = template.replace( '%close', $.FluxusLightbox.settings.close );
            template = template.replace( '%resize', $.FluxusLightbox.settings.resize );
            template = template.replace( '%previous', $.FluxusLightbox.settings.previous );
            template = template.replace( '%next', $.FluxusLightbox.settings.next );

            this.$lightbox = $( template );
            this.$contents = this.$lightbox.find( '.lightbox-content' );

            // DOM events
            this.$next = this.$lightbox.find( '.lightbox-next' ).click( function () {
                self.next.call( self );
                return false;
            });

            this.$prev = this.$lightbox.find( '.lightbox-prev' ).click( function () {
                self.previous.call( self );
                return false;
            });

            this.$close = this.$lightbox.find( '.lightbox-close' ).click( function () {
                self.hide.call( self );
                return false;
            });

            this.$resize = this.$lightbox.find( '.lightbox-resize' ).click( function () {

                if ( self.mode == 'fit' ) {
                    self.fullScreen.call( self );
                } else {
                    self.fitToScreen.call( self );
                }

                return false;

            });

            if ( this.isIOS() ) {
                this.$resize.hide();
                this.options.mode = 'fit';
            }

            if ( this.options.mode == 'fit' ) {

                this.options.mode = '';
                this.fitToScreen();

            } else {

                this.options.mode = '';
                this.fullScreen();

            }

            $( 'body' ).append( this.$lightbox );

        },


        resizeImage: function ( $image ) {

            if ( 0 == $image.length ) {
                return false;
            }

            var self = this;
            var windowHeight = $( window ).height();
            var windowWidth  = $( window ).width();
            var windowRatio  = windowWidth / windowHeight;

            var img = new Image();

            $( img ).load( function () {

                var imageRatio   = img.width / img.height;
                var scaledImageHeight = img.height;

                if ( 'fit' == self.mode ) {

                    if ( windowRatio > imageRatio ) {

                        $image.css({
                            height: '100%',
                            width: 'auto',
                            maxHeight: img.height,
                            maxWidth: img.width
                        });

                    } else {

                        $image.css({
                            width: '100%',
                            height: 'auto',
                            maxHeight: img.height,
                            maxWidth: img.width
                        });

                        scaledImageHeight = windowWidth / imageRatio;

                    }

                    if ( windowHeight > scaledImageHeight ) {
                        $image.css( 'top', Math.round( ( windowHeight - scaledImageHeight ) / 2 ) );
                    } else {
                        $image.css( 'top', 0 );
                    }

                } else {

                    $image.css({
                            width: '100%',
                            height: 'auto'
                        });

                }

            });

            img.src = $image.attr( 'src' );

        },


        fitToScreen: function () {

            if ( this.$resize.is( '.icon-resize-small' ) ) {
                this.$resize.removeClass( 'icon-resize-small' ).addClass( 'icon-resize-full' );
            }

            if ( this.mode == 'fit' ) {
                return;
            }

            this.$lightbox.removeClass( 'mode-full' ).addClass( 'mode-fit' );

            this.mode = 'fit';

            this.resizeImage( this.$lightbox.find( 'img' ) );

        },


        fullScreen: function () {

            if ( this.$resize.is( '.icon-resize-full' ) ) {
                this.$resize.removeClass( 'icon-resize-full' ).addClass( 'icon-resize-small' );
            }

            if ( this.mode == 'full' ) {
                return;
            }

            this.$lightbox.removeClass( 'mode-fit' ).addClass( 'mode-full' );

            this.mode = 'full';

            this.resizeImage( this.$lightbox.find( 'img' ) );

        },


        /**
         * Checks for iOS.
         */
        isIOS: function () {

          return /(iPad|iPhone)/i.test( navigator.userAgent );

        }

    }

    $.fn.fluxusLightbox = function( options ) {

        if ( this.data( 'lightbox' ) == undefined ) {
            this.data( 'lightbox', new $.FluxusLightbox( this, options ) );
        }

        return this;

    }

})( jQuery, window );