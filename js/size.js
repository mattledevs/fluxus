
/**
 * Various size adjustments.
 */

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
        var $pagePortfolio       = $( '.portfolio-list' ),
            $pageGridPortfolio   = $( '.portfolio-grid' ),
            $pagePortfolioSingle = $( '.single-fluxus_portfolio' ),
            $pageAttachment      = $( '.single-attachment' ),
            $page404             = $( 'body.error404' );


        /**
         * Components.
         */
        var $scrollContainer     = $( '.scroll-container' );


        /**
         * Horizontal page adjustements on window resize.
         */
        function horizontal() {

            var windowWidth = $( window ).width();
            var windowHeight = $( window ).height();

            /**
             * Because header is position:fixed
             * we have to calculate the offset for main page dynamically.
             */
            var headerHeight = $header.outerHeight() + $header.offset().top;
            var footerHeight = $footer.outerHeight();


            /**
             * If we are on a small screen.
             */
            if ( windowWidth <= 480 ) {

                if ( $html.is( '.no-scroll' ) ) {

                    $main.css({
                        height: windowHeight - headerHeight,
                        top: 0
                    });

                } else {

                    $main.css({
                        height: 'auto',
                        top: 0
                    });

                }

                if ( $pagePortfolio.length ) {

                    $pagePortfolio.find( '.info' ).css({
                        height: 'auto'
                    });

                }

                if ( $pageGridPortfolio.length ) {

                    var grid = $pageGridPortfolio.data( 'grid' );
                    if ( grid != undefined ) {
                        grid.disable();
                    }

                }

                if ( $pagePortfolioSingle.length ) {

                    $( '#content' ).addTempCss( 'padding-top', $( '.sidebar' ).outerHeight() + 30 );

                }

                return;

            }

            if ( windowWidth <= 768 ) {

                if ( $pagePortfolioSingle.length ) {

                    $( '#content' ).addTempCss( 'padding-top', $( '.sidebar' ).outerHeight() + 30 );

                    return;

                }

            }


            $( '#content' ).removeTempCss( 'padding-top' );

            /**
             * Main area height = window.height - header.height - footer.height;
             */
            var mainHeight = windowHeight - headerHeight - footerHeight;

            $main.css({
                height: mainHeight,
                top: headerHeight
            });


            /**
             * Resizes images, so that post blocks can fit in available window height.
             */
            if ( $html.is( '.horizontal-posts' ) ) {

                var $postSummaries = $( '.post-with-media .text-contents' );

                var minSummaryHeight = $postSummaries.highestElement().outerHeight();

                if ( minSummaryHeight ) {

                    var maxMediaHeight = $main.height() - minSummaryHeight;
                    maxMediaHeight = maxMediaHeight > 328 ? 328 : maxMediaHeight;

                    $( '.resizable' ).each( function () {

                        $( this ).css( 'height', maxMediaHeight );

                        var containerWidth = Math.round( maxMediaHeight / 1.777439024 );
                        containerWidth = containerWidth < 583 ? 583 : containerWidth;

                        $( this ).closest( '.post' )
                                 .css( 'width', containerWidth );

                    });

                    $( '.wrap-embed-video' ).each( function () {

                        var $t = $( this );
                        var $article = $t.closest('article');
                        var $object = $t.children('iframe:first');
                        var ratio = $object.width() / $object.height();
                        $article.css( 'width', Math.round( maxMediaHeight * ratio ) );

                    });

                }

            }


            /**
             * Page: Horizontal portfolio
             */
            if ( $pagePortfolio.length ) {

                var $info = $pagePortfolio.find( '.info' );
                var highestHeight = $info.highestElement().outerHeight();

                $pagePortfolio.find( '.featured-image' ).each( function () {

                    $( this ).css({
                        height: mainHeight - highestHeight
                    });

                });

                $( '.hover-box-contents' ).verticalCenter( { preloadSiblings: false } );

                if ( iPadWithIOS4() ) {

                    var totalWidth = 0;

                    $pagePortfolio.children().each( function () {
                        totalWidth += $( this ).width();
                    } );

                    $pagePortfolio.css( {
                        width: totalWidth
                    });

                }

            }


            /**
             * Page: Portfolio single.
             */
            if ( $pagePortfolioSingle.length ) {

                $pagePortfolioSingle.find( '.image' ).css({
                    height: $main.height()
                });

                if ( iPadWithIOS4() ) {

                    var totalWidth = 0;

                    $pagePortfolioSingle.children().each( function () {
                        totalWidth += $( this ).width();
                    } );

                    $pagePortfolioSingle.css( {
                        width: totalWidth
                    });

                }

            }


            /**
             * Page: Grid portfolio.
             */
            if ( $pageGridPortfolio.length ) {

                var grid = $pageGridPortfolio.data( 'grid' );
                if ( grid != undefined ) {
                    grid.resize();
                }

            }

        }


        /**
         * General size adjustments on resize.
         */
        function general() {

            var windowWidth  = $( window ).width();
            var windowHeight = $( window ).height();

            /**
             * Update tinyscrollbar values.
             */
            $scrollContainer.each( function () {

                var tsb = $( this ).data( 'tsb' );

                $( this ).find( '.scrollbar,.track' ).css({
                    height: $( this ).height()
                });

                if ( tsb != undefined ) {
                    tsb.update();
                }

            });


            if ( windowWidth <= 768 ) {

                /**
                 * For performance reasons initialize mobile menu only
                 * if we have a small sceen size.
                 */
                if ( window.mobileNav == undefined ) {

                    /**
                     * Make mobile menu item array.
                     */
                    var $siteNavigation = $( '.site-navigation' );
                    var $mobileNavItems = $siteNavigation.find( 'a' ).filter( function () {

                        var $t      = $(this);
                        var level   = $t.parents( 'ul' ).length;
                        $t.data( 'level', level );

                        if ( level == 1 ) {
                            return true;
                        } else {
                            if ( $t.closest('.current-menu-item, .current_page_ancestor').length ) {
                                return true;
                            }
                        }
                        return false;

                    });

                    /**
                     * Initialize mobile menu.
                     */
                    window.mobileNav = new MobileNav($mobileNavItems, {
                        openButtonTitle: $siteNavigation.data('menu'),
                        active: $siteNavigation.find('.current-menu-item > a')
                    });

                }

            }

            /**
             * Trigger vertical center plugin.
             */
            setTimeout( function () {
                $( '.js-vertical-center' ).verticalCenter();
            }, 100 );

        }


        /**
         * Bind horizontal-resize event if we are on a horizontal page.
         */
        if ( $html.is( '.horizontal-page' ) ) {

            $( window ).bind( 'resize.fluxus.horizontal-page', debounce( horizontal ) );
            horizontal();

        }


        /**
         * Also bind window resize event to general function.
         */
        $(window).bind( 'resize.fluxus.general', debounce( general ) );
        general();

    });

}( jQuery, window ));

