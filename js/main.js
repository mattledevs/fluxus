(function ( $, window, undefined ) {

    $(function () {

        /**
         * Page layout DOM elements.
         */
        var $html       = $( 'html' ),
            $main       = $( '#main' ),
            $header     = $( '#header' ),
            $footer     = $( '#footer' );

        /**
         * DOM elements of specific pages.
         */
        var $pageHorizontalPosts = $( '.horizontal-posts' ),
            $pagePortfolio       = $( '.portfolio-list' ),
            $pageGridPortfolio   = $( '.portfolio-grid' ),
            $pagePortfolioSingle = $( '.single-fluxus_portfolio' ),
            $page404             = $( 'body.error404' ),
            $keyRight            = $( '#key-right' ),
            $keyLeft             = $( '#key-left' );


        /**
         * Global navigation plugin.
         * Enables keyboard navigation.
         */
        window.globalNav = new Navigation({

            // specify custom align position
            getAlignX: function () {

                var $mainMenuLink = $( '.primary-navigation a:first' );
                if ( $mainMenuLink.length ) {
                    return Math.round( $mainMenuLink.offset().left + parseInt( $mainMenuLink.css('padding-left') ) - $(window).scrollLeft() );
                } else {
                    return Math.round( $( window ).width() / 2 );
                }
            },

            onSetItems: function () {

                $( '.nav-tip' ).show();

            }

        });


        /**
         * Full page slider
         */
        $slider = $( '.slider' );

        if ( $slider.length ) {

            $slider.fluxusSlider({
                onNextSlide: function () {
                    globalNav.options.onItemNext();
                },
                onPreviousSlide: function () {
                    globalNav.options.onItemPrevious();
                }
            });

            if ( $slider.data( 'slider' ).slideCount > 1 ) {
                $( '.nav-tip' ).show();
            }

            globalNav.disableKeyboard();

            $keyRight.click( function () {
                $slider.data( 'slider' ).next();
                return false;
            });

            $keyLeft.click(function () {
                $slider.data( 'slider' ).next();
                return false;
            });

        }


        /**
         * Appreciate plugin
         */
        var $appreciate = $( '.btn-appreciate' );
        $appreciate.appreciate();


        /**
         * Sharrre plugin
         */
        var $sharrreFooter = $( '.sharrre-footer' );
        if ( $sharrreFooter.length ) {

            var services = {};

            // retrieve social networks from DOM element.
            if ( $sharrreFooter.data( 'services' ) != undefined ) {
                $.each( $sharrreFooter.data( 'services' ).split(','), function () {
                    services[this] = true;
                });
            }

            var buttonsTitle = $sharrreFooter.data( 'buttons-title' ) ? $sharrreFooter.data( 'buttons-title' ) : 'Share this page';

            $sharrreFooter.sharrre({
                share: services,
                hover: function ( self, options ) {
                    $( self.element ).find( '.buttons' ).fadeIn();
                },
                hide: function ( self, options ) {
                    $( self.element ).find( '.buttons' ).fadeOut();
                },
                buttonsTemplate: '<b>' + buttonsTitle + '</b>',
                urlCurl: $sharrreFooter.data( 'curl' ),
                template: '<b class="share">{title}</b>' +
                          '<span class="counts">' +
                            ( services.facebook ? '<b class="count-facebook">{facebook}</b>' : '' ) +
                            ( services.twitter ?'<b class="count-twitter">{twitter}</b>' : '' ) +
                            ( services.googlePlus ?'<b class="count-plus">{plus}</b>' : '' ) +
                          '</span>',
                render: function( self, options ) {
                    var html = this.template.replace( '{title}', options.title );
                    html = html.replace( '{facebook}', options.count.facebook );
                    html = html.replace( '{twitter}', options.count.twitter );
                    html = html.replace( '{plus}', options.count.googlePlus );
                    $( self.element ).html( html );
                    $sharrreFooter.show();
                }
            });

        }

        var $sharrreProject = $( '.sharrre-project' );
        if ( $sharrreProject.length ) {

            /**
             * Initialize Share project button.
             */

            var services = {};

            // retrieve social networks from DOM element.
            if ( $sharrreProject.data( 'services' ) != undefined ) {
                $.each( $sharrreProject.data( 'services' ).split(','), function () {
                    services[this] = true;
                });
            }

            var buttonsTitle = $sharrreProject.data( 'buttons-title' ) ? $sharrreProject.data( 'buttons-title' ) : 'Share this page';
            var fadeOutdelay = 0;

            $sharrreProject.sharrre({
                share: services,
                hover: function ( self, options ) {
                    clearTimeout( fadeOutdelay );
                    var $buttons = $( self.element ).find( '.buttons' );
                    var $container = $buttons.closest( '.portfolio-navigation' );
                    $buttons.css({
                        marginLeft: -1* Math.round( $buttons.width() / 2 )
                    }).fadeIn();
                },
                hide: function ( self, options ) {
                    var $buttons = $( self.element ).find( '.buttons' );
                    if ( ! $buttons.is(':animated') ) {
                        fadeOutdelay = setTimeout( function () {
                            $buttons.fadeOut();
                        }, 100 );
                    }
                },
                buttonsTemplate: '<div class="arrow"></div><b>' + buttonsTitle + '</b>',
                urlCurl: $sharrreProject.data( 'curl' ),
                template: '<span class="icon"></span><div class="box">' +
                            '<a class="share" href="#">{title}</a>' +
                            '<b class="count-total">{total}</b>' +
                          '</div>',
                render: function( self, options ) {
                    var total = options.total;
                    if ( options.shorterTotal === true ) {
                        total = self.shorterTotal( total );
                    }
                    var html = this.template.replace( '{title}', options.title );
                    html = html.replace( '{total}', total );
                    $( self.element ).html( html );
                    $sharrreProject.css( 'display', 'inline-block' );
                },
                afterLoadButtons: function () {
                    var index = 0;
                    var $buttons = $( this.element ).find( '.button' );
                    var count = $buttons.each( function () {
                        index++;
                        $( this ).addClass( 'button-' + index );
                    }).length;
                    $( this.element ).addClass( 'social-services-' + count );
                }
            });

        }


        /**
         * Fixes menu issue, when popup is outside the screen.
         */
        $( '.site-navigation .has-children' ).hover( function () {

            var $t = $( this );
            var $submenu = $t.children( '.sub-menu ');

            if ( $submenu.length ) {

                // if popup is outside the screen, then align it by the right side of the screen.
                if ( $submenu.offset().left + $submenu.outerWidth() - $( document ).scrollLeft() > $( window ).width() ) {
                    $submenu.addClass( 'sub-menu-right' );
                }

            }

        }, function () {

            $( this ).children( '.sub-menu' ).removeClass( 'sub-menu-right' );

        });


        /**
         * If our page has horizontal layout.
         */
        if ( $html.is( '.horizontal-page' ) ) {

            /**
             * Enable tinyscrollbar plugin.
             */
            $(".scroll-container").tinyscrollbar({
                axis: 'y'
            });

            /**
             * Enable keyboard navigation.
             */
            globalNav.options.onItemNext = function () {
                $keyRight.addClass( 'flash' );
                setTimeout( function () {
                    $keyRight.removeClass( 'flash' );
                }, 200);
            }

            globalNav.options.onItemPrevious = function () {
                $keyLeft.addClass( 'flash' );
                setTimeout( function () {
                    $keyLeft.removeClass( 'flash' );
                }, 200);
            }

            $keyRight.click( function () {
                globalNav.nextItem();
                return false;
            });

            $keyLeft.click( function () {
                globalNav.previousItem();
                return false;
            });

        }


        /**
         * --------------------------------------------------------------------------------
         * Specific pages
         * --------------------------------------------------------------------------------
         */


        /**
         * Page: Grid portfolio
         */
        if ( $pageGridPortfolio.length ) {

            /**
             * Enable Grid plugin.
             */
            $pageGridPortfolio.grid({

                minWindowWidth: 768,
                rows: $pageGridPortfolio.data( 'rows' ),
                columns: $pageGridPortfolio.data( 'columns' ),

            }, function () {

                $pageGridPortfolio.find('.inner').verticalCenter();

                if ( $pageGridPortfolio.width() > $( window ).width() ) {
                    $( '.nav-tip' ).show();
                } else {
                    $( '.nav-tip' ).hide();
                }

            });

            /**
             * Sets first line of a grid (the longest one) as a source
             * for navigation plugin.
             */
            globalNav.setItems( $pageGridPortfolio.data( 'grid' ).getRowItems( 0 ) );

            if ( $pageGridPortfolio.width() > $( window ).width() ) {
                $( '.nav-tip' ).show();
            } else {
                $( '.nav-tip' ).hide();
            }

        }


        /**
         * Page: Portfolio
         */
        if ( $pagePortfolio.length ) {

            /**
             * Set keyboard navigation items.
             */
            globalNav.setItems( $( '.preview' ) );

            // Show project on image load, which prevents flickering.
            $( '.preview' ).each( function () {

                var $t = $( this );
                var $img = $t.find( 'img' );
                var img = new Image();
                var $hoverBox = $t.find( '.hover-box' );

                $hoverBox.hide();

                $( img ).load( function () {

                    $img.transition( {
                        opacity: 1
                    }, 500 );

                    $hoverBox.show().find( '.hover-box-contents' ).verticalCenter( { preloadSiblings: false } );

                });

                img.src = $img.attr( 'src' );

            });

        }


        /**
         * Page: Portfolio Single
         */
        if ( $pagePortfolioSingle.length ) {

            // Prevent image upscaling and add smooth load.
            $pagePortfolioSingle.find( 'img.image' ).each( function () {

                var img = new Image();
                var $t = $( this );

                $t.css( 'max-height', $t.attr( 'height' ) + 'px' );

                $( img ).load( function () {

                    $t.transition( {
                        opacity: 1
                    }, 500 );

                });

                img.src = $t.attr( 'src' );

            });

            globalNav.setItems( $('.wrap-image, .portfolio-navigation') );

            $pagePortfolioSingle.find( '.wrap-image' ).fluxusLightbox({
                onShow: function () {
                    globalNav.disableKeyboard();
                },
                onHide: function () {
                    globalNav.enableKeyboard();
                },
                loading: $pagePortfolioSingle.data( 'loading' )
            });

        }


        if ( iPadWithIOS4() ) {

            $html.addClass( 'ipad-ios4' );

        }


        /**
         * Page: Blog / Archive / Search
         */
        if ( $pageHorizontalPosts.length ) {

            globalNav.setItems( $pageHorizontalPosts.find( '.post, .navigation-paging' ) );

        }


        /**
         * Page: 404
         */
        if ( $page404.length ) {

            /**
             * This is a not found page.
             * Remove active element from main menu.
             */
           $( '.site-navigation .current_page_parent' ).removeClass( 'current_page_parent' );

        }

        $( '.link-to-image' ).fluxusLightbox();



        /**
         * --------------------------------------------------------------------------------
         * Shortcodes.
         * --------------------------------------------------------------------------------
         */

        /**
         * Shortcode: Tabs
         */
        $( '.tabs' ).each( function () {

            var $t = $( this );

            $t.find( '.tabs-menu a' ).click(function () {

                var $t = $( this ),
                    $p = $t.parent(),
                    index = $p.prevAll().length;

                if ( $p.is( '.active' ) ) {
                    return false;
                }

                $p.parent().find( '.active' ).removeClass( 'active' );
                $p.addClass( 'active' );

                $p.closest( '.tabs' ).find( '.tab' ).hide().end().find( '.tab:eq(' + index + ')' ).show();

                return false;

            }).each( function ( index ) {

                var $t = $( this );

                $t.wrapInner( $( '<span />' ) ).append( $( '<b>' + (index + 1) + '</b class="index">' ) );

            })

        });


        /**
         * Shortcode: Accordion
         */
        $( '.accordion' ).each( function () {

            var $accordion = $( this );

            $accordion.find( '.panel-title a' ).click( function () {

                var $t = $( this );

                /**
                 * This is the active panel. Let's collapse it.
                 */
                if ( $t.closest( '.panel-active' ).length ) {
                    $t.closest( '.panel-active' ).find( '.panel-content' ).slideUp( 500, function () {
                        $( this ).closest( '.panel-active' ).removeClass( 'panel-active' );
                    });
                    return false;
                }

                var $newPanel = $t.closest( '.panel' );
                var index = $newPanel.prevAll().length;

                $panelActive = $accordion.find( '.panel-active' );

                if ( $panelActive.length ) {

                    $panelActive.find( '.panel-content' ).slideUp( 500, function () {
                        $( this ).closest( '.panel' ).removeClass( 'panel-active' );
                        $accordion.find( '.panel:eq(' + index + ') .panel-content' ).slideDown( 300 )
                                  .closest( '.panel' ).addClass( 'panel-active' );

                    });

                } else {

                    $accordion.find( '.panel:eq(' + index + ') .panel-content' ).slideDown( 300 )
                              .closest( '.panel' ).addClass( 'panel-active' );

                }

                return false;

            })

        });


        /**
         * Shortcode: Gallery
         */
        var $galleries = $( '.gallery-link-file' );

        if ( $galleries.length ) {

            $galleries.each( function () {

                $(this).find( 'a' ).fluxusLightbox();

            })

        }

    });


})( jQuery, window );

